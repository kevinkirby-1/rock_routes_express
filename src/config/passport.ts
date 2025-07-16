import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import dotenv from "dotenv";
import User, { AppUser } from "../models/User";

dotenv.config();

// Ensure Google Client ID and Secret are defined
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error(
    "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL must be defined in environment variables"
  );
}

export const initializePassport = () => {
  // --- Google Strategy ---
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },

      async (
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
      ) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User already exists, return the user
            return done(null, user);
          } else {
            // User does not exist, create a new user
            // Extract primary email if available
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null;

            if (!email) {
              console.error("Google profile missing email:", profile);
              return done(new Error("Google profile missing email"), undefined);
            }

            user = await User.create({
              googleId: profile.id,
              email: email,
              // You might want to store more info like profile.displayName or profile.photos[0].value
              // For now, email and Google ID are sufficient for basic auth.
            });
            return done(null, user);
          }
        } catch (err: any) {
          return done(err, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    // We only need to serialize the user's ID
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err: any) {
      done(err, undefined);
    }
  });

  // You can add other strategies (e.g., Apple) here later
};
