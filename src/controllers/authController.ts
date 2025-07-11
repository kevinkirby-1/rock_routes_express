import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if email already associated with user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Add new user to db
    user = await User.create({ email, password });
    // Generate JWT
    const token = generateToken(user._id.toString());
    res.status(201).json({
      message: "User registered successfully",
      appUser: { id: user._id, email: user.email },
      token,
    });
  } catch (error) {
    // Adding new user to db failed
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if email exists on a user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare provided password with user in db
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(user._id.toString());
    res.status(200).json({
      message: "Logged in successfully",
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (error) {
    // Loggin in user failed
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
