import { Router } from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
} from "../controllers/authController";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return process.env.JWT_SECRET;
};

// Email and Password Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth
router.post("/google", googleAuth);

export default router;
