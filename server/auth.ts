import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { users } from '@shared/schema';
import { storage } from './storage';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { log } from './vite';

// Configure passport for Google OAuth
export function setupPassport() {
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

  passport.deserializeUser(async (id: number, done) => {
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