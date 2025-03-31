import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, User } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import { generateToken, verifyToken, extractTokenFromRequest, JwtPayload } from "./jwt";

// Middleware for role-based access control
interface AuthUser {
  id: number;
  username: string;
  role: 'admin' | 'ambassador' | 'member' | null;
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
  
  if (user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  
  return next();
};

// Middleware to check if user has ambassador or admin role
const isAmbassadorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserInfo(req);
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (user.role !== 'admin' && user.role !== 'ambassador') {
    return res.status(403).json({ message: "Forbidden: Ambassador or Admin access required" });
  }
  
  return next();
};

export async function registerRoutes(app: Express): Promise<Server> {

  // Google OAuth routes
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/?error=auth-failed' 
    }),
    (req, res) => {
      // Generate JWT token for the authenticated user
      if (req.user) {
        const token = generateToken(req.user as User);
        
        // Set JWT token as a cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }
      
      // Successful authentication
      res.redirect('/?success=google-auth');
    }
  );

  app.get('/auth/logout', (req, res) => {
    // Clear session
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
      }
      
      // Clear JWT token cookie
      res.clearCookie('token');
      
      res.redirect('/');
    });
  });
  
  // POST endpoint for logout (for API calls)
  app.post('/api/auth/logout', (req, res) => {
    // Clear session
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ message: 'Error during logout' });
      }
      
      // Clear JWT token cookie
      res.clearCookie('token');
      
      res.json({ message: 'Successfully logged out' });
    });
  });

  // LOGIN endpoint - Generate JWT token
  app.post('/api/auth/login', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const token = generateToken(req.user as User);
    
    // Set JWT token as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Also return token in response for clients that need it
    res.json({
      token,
      user: req.user
    });
  });

  // Get user info - supports both session and JWT auth
  app.get('/api/user', async (req, res) => {
    // Check for session authentication
    if (req.isAuthenticated()) {
      return res.json({ 
        user: req.user,
        isAuthenticated: true 
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
            isAuthenticated: true
          });
        }
      }
    }
    
    // Not authenticated
    res.json({ 
      user: null,
      isAuthenticated: false 
    });
  });
  
  // Get current authenticated user - supports both session and JWT auth
  app.get('/api/me', async (req, res) => {
    const user = await getUserInfo(req);
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json(user);
  });

  // put application routes here
  // prefix all routes with /api

  // API endpoint to handle the waitlist form submission
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate the request body using the Zod schema
      const validatedEntry = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(validatedEntry.email);
      if (existingEntry) {
        return res.status(409).json({ 
          message: "This email is already on our waitlist." 
        });
      }
      
      // Create the waitlist entry
      const entry = await storage.createWaitlistEntry(validatedEntry);
      
      return res.status(201).json({ 
        message: "Successfully joined the waitlist!",
        entry 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error submitting waitlist entry:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // API endpoint to get all waitlist entries (admin-only)
  app.get("/api/waitlist", isAdmin, async (req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      return res.status(200).json(entries);
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      return res.status(500).json({ 
        message: "An error occurred while fetching the waitlist entries." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
