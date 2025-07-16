"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
// Ensure Google Client ID and Secret are defined
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new Error("GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL must be defined in environment variables");
}
const initializePassport = () => {
    // --- Google Strategy ---
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User_1.default.findOne({ googleId: profile.id });
            if (user) {
                // User already exists, return the user
                return done(null, user);
            }
            else {
                // User does not exist, create a new user
                // Extract primary email if available
                const email = profile.emails && profile.emails.length > 0
                    ? profile.emails[0].value
                    : null;
                if (!email) {
                    console.error("Google profile missing email:", profile);
                    return done(new Error("Google profile missing email"), undefined);
                }
                user = await User_1.default.create({
                    googleId: profile.id,
                    email: email,
                    // You might want to store more info like profile.displayName or profile.photos[0].value
                    // For now, email and Google ID are sufficient for basic auth.
                });
                return done(null, user);
            }
        }
        catch (err) {
            return done(err, undefined);
        }
    }));
    passport_1.default.serializeUser((user, done) => {
        // We only need to serialize the user's ID
        done(null, user.id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await User_1.default.findById(id);
            done(null, user);
        }
        catch (err) {
            done(err, undefined);
        }
    });
    // You can add other strategies (e.g., Apple) here later
};
exports.initializePassport = initializePassport;
