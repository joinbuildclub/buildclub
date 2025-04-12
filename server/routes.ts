import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import {
  insertHubEventRegistrationSchema,
  insertUserSchema,
  User,
  Event,
  hubEventRegistrations,
  RoleEnum,
  users,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Extend Express.Session to include our custom fields
declare module "express-session" {
  interface SessionData {
    convertEmail?: string;
  }
}

import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import {
  generateToken,
  verifyToken,
  extractTokenFromRequest,
  JwtPayload,
} from "./jwt";
import { eq, desc } from "drizzle-orm";
import {
  sendWelcomeEmail,
  sendAdminNotification,
  sendRegistrationCancellation,
  sendAccountVerificationEmail,
  sendAccountConfirmedEmail,
} from "./sendgrid";
import { hashPassword } from "./auth";

// Middleware for role-based access control
interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "ambassador" | "member" | null;
  email?: string | null;
  password?: string | null;
  googleId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
}

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // First check session authentication (for backward compatibility)
  if (req.isAuthenticated()) {
    return next();
  }

  // Then check JWT token
  const token = extractTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Add user info to request
  (req as any).jwtPayload = payload;
  return next();
};

// Helper to get user info from either session or JWT
const getUserInfo = async (req: Request): Promise<AuthUser | null> => {
  // Check session first
  if (req.isAuthenticated() && req.user) {
    return req.user as AuthUser;
  }

  // Then check JWT
  const payload = (req as any).jwtPayload as JwtPayload | undefined;
  if (payload) {
    // Get the full user from database
    const user = await storage.getUser(payload.userId);
    return user || null;
  }

  return null;
};

// Middleware to check if user has admin role
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserInfo(req);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  return next();
};

// Middleware to check if user has ambassador or admin role
const isAmbassadorOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await getUserInfo(req);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "admin" && user.role !== "ambassador") {
    return res
      .status(403)
      .json({ message: "Forbidden: Ambassador or Admin access required" });
  }

  return next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Standard Google OAuth route
  app.get(
    "/auth/google",
    (req, res, next) => {
      // Store email from session or query params if provided
      if (req.query.email) {
        req.session.convertEmail = req.query.email as string;
      }
      next();
    },
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/?error=auth-failed",
    }),
    async (req, res) => {
      if (!req.user) {
        return res.redirect("/?error=auth-failed-no-user");
      }

      const user = req.user as User;

      // Check if we need to convert a guest account
      const convertEmail = req.session.convertEmail;
      if (convertEmail) {
        try {
          // Find if there's a guest account with this email
          const guestUser = await storage.getUserByEmail(convertEmail);

          if (guestUser && guestUser.isGuest) {
            console.log(
              `Converting guest account ${convertEmail} via Google OAuth`,
            );

            // Get the Google user's email
            if (user.email !== convertEmail) {
              console.log(
                `Warning: Google account email (${user.email}) doesn't match guest account email (${convertEmail})`,
              );
              // We'll still proceed but log the discrepancy
            }

            // Update the guest account with Google user data
            const updatedData: Partial<User> = {
              googleId: user.googleId,
              email: user.email, // Use Google's verified email
              firstName: user.firstName || guestUser.firstName,
              lastName: user.lastName || guestUser.lastName,
              profilePicture: user.profilePicture,
              isGuest: false, // Mark as no longer a guest
              role: "member", // Ensure role is a valid value
            };

            // Convert the guest account
            await storage.convertGuestAccount(convertEmail, updatedData);

            // Clear the session variable
            delete req.session.convertEmail;

            // After successful conversion, redirect to dashboard
            res.redirect("/dashboard/?success=account-converted");
            return;
          }
        } catch (error) {
          console.error(
            "Error converting guest account via Google OAuth:",
            error,
          );
          // Continue with normal flow even if conversion fails
        }

        // Clear the session variable even if conversion failed
        delete req.session.convertEmail;
      }

      // Normal Google OAuth flow - generate JWT token
      const token = generateToken(user);

      // Set JWT token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production, allow HTTP for development
        sameSite: "lax", // Enhanced security
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Successful authentication
      res.redirect("/dashboard/?success=google-auth");
    },
  );

  app.get("/auth/logout", (req, res) => {
    // Clear session
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
      }

      // Clear JWT token cookie
      res.clearCookie("token");

      res.redirect("/");
    });
  });

  // POST endpoint for logout (for API calls)
  app.post("/api/auth/logout", (req, res) => {
    // Clear session
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Error during logout" });
      }

      // Clear JWT token cookie
      res.clearCookie("token");

      res.json({ message: "Successfully logged out" });
    });
  });

  // REGISTER endpoint - Create a new user with email/password
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate user data
      const userData = insertUserSchema.parse(req.body);

      // Check if email already exists
      if (userData.email) {
        const existingUser = await storage.getUserByEmail(userData.email);

        // If there's an existing guest account with this email, convert it instead of creating a new one
        if (existingUser && existingUser.isGuest) {
          console.log(
            `Converting guest account with email ${userData.email} to permanent account`,
          );

          // Hash password if provided
          if (userData.password) {
            userData.password = await hashPassword(userData.password);
          }

          // Make sure role is one of the valid enum values
          if (
            userData.role &&
            !["admin", "ambassador", "member"].includes(userData.role as string)
          ) {
            userData.role = "member" as any; // Force it to be a valid value
          }

          // Create a properly typed userData object with validated role
          const validatedUserData: Partial<User> = {
            ...userData,
            // Ensure role is cast to the proper type
            role:
              userData.role &&
              ["admin", "ambassador", "member"].includes(
                userData.role as string,
              )
                ? (userData.role as "admin" | "ambassador" | "member")
                : "member",
          };

          // Convert the guest account to a permanent one
          const updatedUser = await storage.convertGuestAccount(
            userData.email,
            validatedUserData,
          );

          if (!updatedUser) {
            return res
              .status(500)
              .json({ message: "Failed to convert guest account" });
          }

          // Log the user in
          req.login(updatedUser, (err) => {
            if (err) {
              console.error(
                "Error logging in after guest account conversion:",
                err,
              );
              return res
                .status(500)
                .json({ message: "Error during authentication" });
            }

            // Generate JWT token for the authenticated user
            const token = generateToken(updatedUser);

            // Set JWT token as a cookie
            res.cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Secure in production, allow HTTP for development
              sameSite: "lax", // Enhanced security
              path: "/",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(200).json({
              message:
                "Guest account successfully converted to permanent account",
              user: updatedUser,
              token,
            });
          });

          return;
        }

        // Regular case - email already exists and not a guest
        if (existingUser) {
          return res
            .status(409)
            .json({ message: "Email is already registered" });
        }
      }

      // Auto-generate username from email if not provided
      if (!userData.username && userData.email) {
        // Get the part before the @ sign and add a random suffix to ensure uniqueness
        userData.username = `${userData.email.split("@")[0]}_${Math.floor(Math.random() * 1000)}`;
      }

      // Hash password
      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }

      // Create user with default role of "member" if not specified
      if (!userData.role) {
        userData.role = "member";
      }

      // Generate a confirmation token for email verification (unless it's a Google account)
      const confirmationToken = randomUUID();
      if (userData.email && !userData.googleId) {
        userData.isConfirmed = false;
        userData.accountConfirmationToken = confirmationToken;
      } else if (userData.googleId) {
        // Google-authenticated users are automatically verified
        userData.isConfirmed = true;
      }

      // Create the user - but skip the automatic sendWelcomeEmail process since we need to verify email first
      userData.skipWelcomeEmail =
        userData.email && !userData.googleId && !userData.isConfirmed;
      const newUser = await storage.createUser(userData);

      // Send verification email for email/password users
      if (userData.email && !userData.googleId && !userData.isConfirmed) {
        try {
          await sendAccountVerificationEmail(newUser, confirmationToken);
          console.log(`Verification email sent to ${userData.email}`);

          // For email/password users that need verification, return without logging in
          return res.status(201).json({
            message:
              "Registration successful. Please check your email to verify your account.",
            needsVerification: true,
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
          // Continue with registration even if email sending fails, but note that verification is still needed
          return res.status(201).json({
            message:
              "Registration successful, but we couldn't send a verification email. Please try again later.",
            needsVerification: true,
          });
        }
      }

      // For social auth users (Google) or any users that don't need verification, log them in immediately
      req.login(newUser, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error during login", error: err.message });
        }

        // Generate JWT token
        const token = generateToken(newUser);

        // Set JWT token as cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return user data (excluding password)
        const { password, ...userWithoutPassword } = newUser;
        return res.status(201).json({
          message: "User registered successfully",
          user: userWithoutPassword,
          token,
          needsVerification: false,
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error during registration:", error);
      return res.status(500).json({
        message: "An error occurred during registration",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // LOGIN endpoint - Generate JWT token
  app.post(
    "/api/auth/login",
    passport.authenticate("local", { session: true }),
    (req, res) => {
      // Check if the user's email is confirmed
      const user = req.user as User;

      if (user && user.isConfirmed === false) {
        // User's email is not verified
        return res.status(403).json({
          message:
            "Please verify your email before logging in. Check your email for a verification link or request a new one.",
          needsVerification: true,
          email: user.email,
        });
      }

      // If we get here, authentication was successful and email is verified
      const token = generateToken(user);

      // Set JWT token as cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production, allow HTTP for development
        sameSite: "lax", // Enhanced security
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Also return token in response for clients that need it
      res.json({
        token,
        user: req.user,
      });
    },
  );

  // Get user info - supports both session and JWT auth
  app.get("/api/user", async (req, res) => {
    // Check for session authentication
    if (req.isAuthenticated()) {
      return res.json({
        user: req.user,
        isAuthenticated: true,
      });
    }

    // Check for JWT authentication
    const token = extractTokenFromRequest(req);
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = await storage.getUser(payload.userId);
        if (user) {
          return res.json({
            user,
            isAuthenticated: true,
          });
        }
      }
    }

    // Not authenticated
    res.json({
      user: null,
      isAuthenticated: false,
    });
  });

  // Get current authenticated user - supports both session and JWT auth
  app.get("/api/me", async (req, res) => {
    const user = await getUserInfo(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json(user);
  });

  // put application routes here
  // prefix all routes with /api

  // Hub related routes
  app.get("/api/hubs", async (req, res) => {
    try {
      const hubs = await storage.getHubs();
      return res.status(200).json(hubs);
    } catch (error) {
      console.error("Error fetching hubs:", error);
      return res.status(500).json({
        message: "An error occurred while fetching the hubs.",
      });
    }
  });

  app.post("/api/hubs", isAdmin, async (req, res) => {
    try {
      const hub = await storage.createHub(req.body);
      return res.status(201).json(hub);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating hub:", error);
      return res.status(500).json({
        message: "An error occurred while creating the hub.",
      });
    }
  });

  // Event related routes
  app.get("/api/events", async (req, res) => {
    try {
      const filters = {
        isPublished:
          req.query.published === "true"
            ? true
            : req.query.published === "false"
              ? false
              : undefined,
        hubId: req.query.hubId as string | undefined,
      };

      const events = await storage.getEvents(filters);
      return res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({
        message: "An error occurred while fetching the events.",
      });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await storage.getEvent(eventId);

      if (!event) {
        return res.status(404).json({
          message: "Event not found.",
        });
      }

      // Get the hub events for this event
      const hubEvents = await storage.getHubEventsByEventId(eventId);

      // Get hub information if available
      let hub = null;
      let hubEventId = null;

      if (hubEvents.length > 0) {
        // Get the primary hub event or the first one if no primary
        const primaryHubEvent =
          hubEvents.find((he) => he.isPrimary) || hubEvents[0];
        hubEventId = primaryHubEvent.id;

        // Get the hub information
        const hubInfo = await storage.getHub(primaryHubEvent.hubId);
        if (hubInfo) {
          hub = {
            id: hubInfo.id,
            name: hubInfo.name,
            location: hubInfo.city, // Use city as location
          };
        }
      }

      return res.status(200).json({
        ...event,
        hubEventId,
        hub,
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      return res.status(500).json({
        message: "An error occurred while fetching the event.",
      });
    }
  });

  app.post("/api/events", isAmbassadorOrAdmin, async (req, res) => {
    try {
      const user = await getUserInfo(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const eventData = {
        ...req.body,
        createdById: user.id,
      };

      const event = await storage.createEvent(eventData);
      return res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating event:", error);
      return res.status(500).json({
        message: "An error occurred while creating the event.",
      });
    }
  });

  // Hub Event related routes
  app.get("/api/hub-events", async (req, res) => {
    try {
      const eventId = req.query.eventId as string;
      const hubId = req.query.hubId as string;

      let hubEvents = [];

      if (eventId) {
        hubEvents = await storage.getHubEventsByEventId(eventId);
      } else if (hubId) {
        hubEvents = await storage.getHubEventsByHubId(hubId);
      } else {
        return res.status(400).json({
          message: "Either eventId or hubId query parameter is required.",
        });
      }

      return res.status(200).json(hubEvents);
    } catch (error) {
      console.error("Error fetching hub events:", error);
      return res.status(500).json({
        message: "An error occurred while fetching the hub events.",
      });
    }
  });

  app.post("/api/hub-events", isAmbassadorOrAdmin, async (req, res) => {
    try {
      const hubEvent = await storage.createHubEvent(req.body);
      return res.status(201).json(hubEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating hub event:", error);
      return res.status(500).json({
        message: "An error occurred while creating the hub event.",
      });
    }
  });

  // Event registration endpoint
  app.post("/api/events/register", async (req, res) => {
    try {
      // Validate the request body using the Zod schema
      const validatedRegistration = insertHubEventRegistrationSchema.parse(
        req.body,
      );

      // Check if email already exists for this hub event
      const existingRegistration = await storage.getHubEventRegistrationByEmail(
        validatedRegistration.hubEventId,
        validatedRegistration.email,
      );

      if (existingRegistration) {
        return res.status(409).json({
          message: "You are already registered for this event.",
        });
      }

      // Get user ID if authenticated
      const user = await getUserInfo(req);

      if (user) {
        validatedRegistration.userId = user.id;
      }

      // If no user is authenticated, create a guest user account
      if (!user) {
        let userIdToUse = null;
        const existingUser = await storage.getUserByEmail(
          validatedRegistration.email,
        );
        if (existingUser) {
          userIdToUse = existingUser.id;
        } else {
          // Create a guest user account
          const guestUser = await storage.createUser({
            username: validatedRegistration.email, // Use email as username
            email: validatedRegistration.email,
            firstName: validatedRegistration.firstName,
            lastName: validatedRegistration.lastName,
            isGuest: true,
            role: "member",
          });
          userIdToUse = guestUser.id;
        }

        validatedRegistration.userId = userIdToUse;
      }

      // Create the registration
      const registration = await storage.createHubEventRegistration(
        validatedRegistration,
      );

      return res.status(201).json({
        message: "Successfully registered for the event!",
        registration,
      });
    } catch (error) {
      console.error("Error registering for event:", error);
      return res.status(500).json({
        message: "An error occurred while processing your registration.",
      });
    }
  });

  // Get user's event registrations
  app.get("/api/my-registrations", isAuthenticated, async (req, res) => {
    try {
      const user = await getUserInfo(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const registrations = await storage.getUserEventRegistrations(user.id);
      return res.status(200).json(registrations);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      return res.status(500).json({
        message: "An error occurred while fetching your registrations.",
      });
    }
  });

  // Update registration status
  app.patch(
    "/api/registrations/:id/status",
    isAuthenticated,
    async (req, res) => {
      try {
        const registrationId = req.params.id as string;
        const { status } = req.body;

        if (
          !status ||
          !["registered", "confirmed", "attended", "cancelled"].includes(status)
        ) {
          return res.status(400).json({ message: "Invalid status value" });
        }

        // Make sure user owns this registration or is admin/ambassador
        const user = await getUserInfo(req);
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const registration =
          await storage.getHubEventRegistration(registrationId);
        if (!registration) {
          return res.status(404).json({ message: "Registration not found" });
        }

        // Check if user has permission (owns registration or is admin/ambassador)
        if (
          registration.userId !== user.id &&
          user.role !== "admin" &&
          user.role !== "ambassador"
        ) {
          return res.status(403).json({
            message: "You don't have permission to update this registration",
          });
        }

        // Update status
        const updatedRegistration = await storage.updateRegistrationStatus(
          registrationId,
          status as "registered" | "confirmed" | "attended" | "cancelled",
        );

        // If cancelled, send cancellation email
        if (status === "cancelled") {
          try {
            // Get the event details
            const hubEvent = await storage.getHubEvent(registration.hubEventId);
            if (hubEvent) {
              const event = await storage.getEvent(hubEvent.eventId);
              if (event) {
                await sendRegistrationCancellation(registration, event);
              }
            }
          } catch (emailError) {
            console.error("Error sending cancellation email:", emailError);
            // Continue with response even if email fails
          }
        }

        return res.status(200).json({
          message: `Registration status updated to ${status}`,
          registration: updatedRegistration,
        });
      } catch (error) {
        console.error("Error updating registration status:", error);
        return res.status(500).json({
          message: "An error occurred while updating the registration status.",
        });
      }
    },
  );

  // Delete registration (unregister)
  app.delete("/api/registrations/:id", isAuthenticated, async (req, res) => {
    try {
      const registrationId = req.params.id as string;

      // Make sure user owns this registration or is admin
      const user = await getUserInfo(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const registration =
        await storage.getHubEventRegistration(registrationId);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      // Check if user has permission (owns registration or is admin)
      if (registration.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({
          message: "You don't have permission to delete this registration",
        });
      }

      // Send cancellation email before deleting
      try {
        const hubEvent = await storage.getHubEvent(registration.hubEventId);
        if (hubEvent) {
          const event = await storage.getEvent(hubEvent.eventId);
          if (event) {
            await sendRegistrationCancellation(registration, event);
          }
        }
      } catch (emailError) {
        console.error(
          "Error sending cancellation email before deletion:",
          emailError,
        );
        // Continue with deletion even if email fails
      }

      // Delete registration
      const deleted = await storage.deleteRegistration(registrationId);

      if (deleted) {
        return res
          .status(200)
          .json({ message: "Registration successfully deleted" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to delete registration" });
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      return res.status(500).json({
        message: "An error occurred while deleting the registration.",
      });
    }
  });

  // Get registrations for a hub event (admin or ambassador only)
  app.get(
    "/api/hub-events/:hubEventId/registrations",
    isAmbassadorOrAdmin,
    async (req, res) => {
      try {
        const hubEventId = req.params.hubEventId as string;
        const registrations =
          await storage.getHubEventRegistrationsByHubEventId(hubEventId);

        return res.status(200).json(registrations);
      } catch (error) {
        console.error("Error fetching event registrations:", error);
        return res.status(500).json({
          message: "An error occurred while fetching the registrations.",
        });
      }
    },
  );

  // Community members API endpoints (renamed from registrations/waitlist)
  app.post("/api/registrations", async (req, res) => {
    try {
      // Since we're using Google auth for signup, this endpoint is just a legacy
      // fallback. New users should use the Google Auth button which creates
      // proper user accounts directly.

      // Create a user account directly instead of a waitlist entry
      const user = await storage.createUser({
        username: req.body.email, // Use email as username
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        interests: req.body.interestAreas, // Map interest areas to interests
        isGuest: false, // These users are explicitly registering
        role: "member",
      });

      // Send welcome and admin notification emails - we'll use the existing email functions
      // but with our new user data shaped like the old entry format
      try {
        const entryFormat = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          interestAreas: req.body.interestAreas,
          aiInterests: req.body.aiInterests,
        };

        await sendWelcomeEmail(entryFormat as any);
        await sendAdminNotification(entryFormat as any);
      } catch (emailError) {
        console.error("Error sending notification emails:", emailError);
        // Continue processing even if emails fail
      }

      return res.status(201).json({
        message: "Successfully registered!",
        user: user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error submitting registration:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request.",
      });
    }
  });

  // Get all event registrations (admin-only)
  app.get("/api/registrations", isAdmin, async (req, res) => {
    try {
      // Get all registrations from hubEventRegistrations table
      // Use a specific column selection to avoid errors with missing columns
      const registrations = await db
        .select({
          id: hubEventRegistrations.id,
          hubEventId: hubEventRegistrations.hubEventId,
          userId: hubEventRegistrations.userId,
          firstName: hubEventRegistrations.firstName,
          lastName: hubEventRegistrations.lastName,
          email: hubEventRegistrations.email,
          interestAreas: hubEventRegistrations.interestAreas,
          aiInterests: hubEventRegistrations.aiInterests,
          status: hubEventRegistrations.status,
          notes: hubEventRegistrations.notes,
          createdAt: hubEventRegistrations.createdAt,
        })
        .from(hubEventRegistrations)
        .orderBy(desc(hubEventRegistrations.createdAt));

      // For each registration, fetch associated event and hub data
      const enrichedRegistrations = await Promise.all(
        registrations.map(async (registration) => {
          try {
            const hubEvent = await storage.getHubEvent(registration.hubEventId);

            if (!hubEvent) {
              return {
                registration,
                event: { title: "Unknown Event" },
                hub: { name: "Unknown Hub" },
                hubEvent: { id: registration.hubEventId },
              };
            }

            const event = await storage.getEvent(hubEvent.eventId);
            const hub = await storage.getHub(hubEvent.hubId);

            return {
              registration,
              event: event || { title: "Unknown Event" },
              hub: hub || { name: "Unknown Hub" },
              hubEvent,
            };
          } catch (err) {
            console.error("Error enriching registration data:", err);
            return {
              registration,
              event: { title: "Error loading event" },
              hub: { name: "Error loading hub" },
              hubEvent: { id: registration.hubEventId },
            };
          }
        }),
      );

      // Filter out any null values (from failed lookups)
      return res.status(200).json(enrichedRegistrations.filter(Boolean));
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return res.status(500).json({
        message: "An error occurred while fetching registrations.",
      });
    }
  });

  // Legacy API endpoints for backward compatibility
  app.post("/api/waitlist", async (req, res) => {
    return res.redirect(307, "/api/registrations");
  });

  app.get("/api/waitlist", isAdmin, async (req, res) => {
    return res.redirect(307, "/api/registrations");
  });

  // User onboarding endpoint
  app.post("/api/user/onboard", isAuthenticated, async (req, res) => {
    try {
      const user = await getUserInfo(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Update user profile
      const updatedUser = await storage.updateUser(user.id, {
        twitterHandle: req.body.twitterHandle,
        linkedinUrl: req.body.linkedinUrl,
        githubUsername: req.body.githubUsername,
        bio: req.body.bio,
        interests: req.body.interests,
        isOnboarded: true,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({
        message: "An error occurred while updating your profile.",
      });
    }
  });

  // Email verification endpoints

  // Verify email with token
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res
          .status(400)
          .json({ message: "Verification token is required" });
      }

      // Find user with this token
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.accountConfirmationToken, token as string));

      if (!user) {
        return res
          .status(404)
          .json({ message: "Invalid or expired verification token" });
      }

      // Update user's verification status
      const updatedUser = await storage.updateUser(user.id, {
        isConfirmed: true,
        accountConfirmationToken: null, // Clear the token
      });

      // Send welcome email NOW that the user is verified
      try {
        await sendAccountConfirmedEmail(updatedUser);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Continue even if email fails
      }

      // Redirect to login page with success message
      return res.redirect(
        `/auth?verified=true&email=${encodeURIComponent(user.email || "")}`,
      );
    } catch (error) {
      console.error("Error verifying email:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during email verification" });
    }
  });

  // Resend verification email
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find the user by email
      const user = await storage.getUserByEmail(email);

      if (!user) {
        // Don't reveal whether the email exists for security
        return res.status(200).json({
          message:
            "If your email exists in our system, a verification link has been sent",
        });
      }

      // Check if account is already verified
      if (user.isConfirmed) {
        return res.status(400).json({ message: "Email is already verified" });
      }

      // Generate a new confirmation token
      const confirmationToken = randomUUID();

      // Update user with new token
      const updatedUser = await storage.updateUser(user.id, {
        accountConfirmationToken: confirmationToken,
      });

      // Send verification email
      await sendAccountVerificationEmail(updatedUser, confirmationToken);

      return res
        .status(200)
        .json({ message: "Verification email has been sent" });
    } catch (error) {
      console.error("Error resending verification email:", error);
      return res.status(500).json({
        message: "An error occurred while sending verification email",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
