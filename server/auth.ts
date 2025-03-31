import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { users } from '@shared/schema';
import { storage } from './storage';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { log } from './vite';
import bcrypt from 'bcrypt';

// Configure passport for Google OAuth
// Helper function to hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Helper function to compare password with hashed password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function setupPassport() {
  // Setup Local Strategy for email/password login
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await storage.getUserByEmail(email);
        
        // If user not found or no password (Google auth user), return error
        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        // Compare password with stored hash
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        // Success - return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Setup Google OAuth Strategy
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    log('Warning: Missing Google OAuth credentials. OAuth authentication will not work.', 'auth');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const [existingUser] = await db.select().from(users).where(eq(users.googleId, profile.id));

          if (existingUser) {
            return done(null, existingUser);
          }

          // If not, create a new user
          const emails = profile.emails || [];
          const photos = profile.photos || [];
          const email = emails.length > 0 ? emails[0].value : '';
          const profilePicture = photos.length > 0 ? photos[0].value : '';
          
          const username = email.split('@')[0] + '-' + profile.id.substring(0, 5);
          
          const newUser = await storage.createUser({
            username,
            googleId: profile.id,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            email,
            profilePicture,
          });

          return done(null, newUser);
        } catch (error) {
          log(`Error during Google authentication: ${error}`, 'auth');
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, (user as any).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

export const passportMiddleware = passport.initialize();
export const passportSession = passport.session();