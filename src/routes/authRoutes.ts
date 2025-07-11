import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppUser } from "../models/User";

dotenv.config();

const router = Router();

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return process.env.JWT_SECRET;
};

const generateToken = (id: string): string => {
  return jwt.sign({ id }, getJwtSecret(), { expiresIn: "1h" });
};

// Email and Password Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user as AppUser;

    if (!user) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    const token = generateToken(user._id.toString());

    // Send the user data and token back to the client
    // When frontend done redirect the user to your frontend dashboard with token/user info in query params or cookie
    // For API testing, sending JSON is fine.
    res.status(200).json({
      message: "Google login successful",
      user: { id: user._id, email: user.email }, // Send back relevant user info
      token,
    });
  }
);

export default router;
