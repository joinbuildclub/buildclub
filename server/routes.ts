import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";

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
      // Successful authentication
      res.redirect('/?success=google-auth');
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
      }
      res.redirect('/');
    });
  });

  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ 
        user: req.user,
        isAuthenticated: true 
      });
    } else {
      res.json({ 
        user: null,
        isAuthenticated: false 
      });
    }
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

  // API endpoint to get all waitlist entries (could be admin-only in a real app)
  app.get("/api/waitlist", async (req, res) => {
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
