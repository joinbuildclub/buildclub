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
        
        // Check if account is verified (Google users are auto-verified)
        if (!user.isConfirmed && !user.googleId) {
          return done(null, false, { message: 'Email not verified. Please check your inbox for verification email.' });
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
          // Check if user already exists by Google ID
          const [existingUserByGoogleId] = await db.select().from(users).where(eq(users.googleId, profile.id));
          
          if (existingUserByGoogleId) {
            return done(null, existingUserByGoogleId);
          }
          
          // Extract profile information
          const emails = profile.emails || [];
          const photos = profile.photos || [];
          const email = emails.length > 0 ? emails[0].value : '';
          const profilePicture = photos.length > 0 ? photos[0].value : '';
          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';
          
          // If we have an email, check if a user with this email already exists (could be a guest account)
          if (email) {
            // First check if there's an existing user with this email (guest or regular)
            const existingUserByEmail = await storage.getUserByEmail(email);
            
            if (existingUserByEmail) {
              // If this is a guest account, convert it to a permanent Google account
              if (existingUserByEmail.isGuest) {
                console.log(`Converting guest account with email ${email} to Google account`);
                
                // Update the guest user with Google profile information
                const updatedUser = await storage.updateUser(existingUserByEmail.id, {
                  googleId: profile.id,
                  firstName: firstName || existingUserByEmail.firstName,
                  lastName: lastName || existingUserByEmail.lastName,
                  profilePicture: profilePicture || existingUserByEmail.profilePicture,
                  isGuest: false, // No longer a guest
                  isConfirmed: true, // Google users are automatically verified
                  role: "member" // Make sure role is set
                });
                
                return done(null, updatedUser);
              }
              
              // If it's not a guest but has the same email, we shouldn't create a duplicate
              // Instead, update the existing account to link it with Google
              console.log(`Linking existing account with email ${email} to Google`);
              const updatedUser = await storage.updateUser(existingUserByEmail.id, {
                googleId: profile.id,
                profilePicture: profilePicture || existingUserByEmail.profilePicture
              });
              
              return done(null, updatedUser);
            }
          }
          
          // If we get here, no existing user was found - create a new one
          const username = email.split('@')[0] + '-' + profile.id.substring(0, 5);
          
          const newUser = await storage.createUser({
            username,
            googleId: profile.id,
            firstName,
            lastName,
            email,
            profilePicture,
            isConfirmed: true, // Google users are automatically verified
            role: "member" // Make sure role is explicitly set
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