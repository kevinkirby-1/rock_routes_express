import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const registerUser = async (req: Request, res: Response) => {
  const { given_name, family_name, name, email, password } = req.body;

  try {
    // Check if email already associated with user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Add new user to db
    user = await User.create({
      given_name,
      family_name,
      name,
      email,
      password,
    });
    // Generate JWT
    const token = generateToken(user._id.toString());
    res.status(201).json({
      message: "User registered successfully",
      user,
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
      return res.status(400).json({ message: "Invalid Email" });
    }

    // Compare provided password with user in db
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Generate JWT
    const token = generateToken(user._id.toString());
    res.status(200).json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    // Loggin in user failed
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your backend's Google Client ID

export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // Get verified user information
    const { sub, email, name, given_name, family_name, picture } = payload!; // 'sub' is Google's unique user ID

    // Find or create user in your own database
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub, // Store Google's unique ID
        email,
        name,
        given_name,
        family_name,
        picture,
        // profilePicture: picture,
      });
    }
    // If user exists but no googleId (e.g., previously registered with email/password)
    else if (!user.googleId) {
      user.googleId = sub;
      //  user.profilePicture = picture;
      await user.save();
    }

    // Generate your application's JWT for this user
    const appJwt = generateToken(user._id.toString());

    res.status(200).json({
      user,
      token: appJwt, // Send your app's JWT back
      // profilePicture: user.profilePicture
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error.message);
    res
      .status(401)
      .json({ message: "Google authentication failed. Invalid token." });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  res.status(200).json(req.appUser);
};
