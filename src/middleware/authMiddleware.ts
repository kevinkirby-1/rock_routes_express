import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { AppUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

// Confirm if user is logged in
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      req.appUser = (await User.findById(decoded.id)
        .select("-password")
        .lean()) as AppUser;

      if (!req.appUser) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error: any) {
      console.error(error);
      res.status(401);
      if (error.name === "TokenExpiredError") {
        res.json({ message: "Not authorized, token expired" });
      } else if (error.name === "JsonWebTokenError") {
        res.json({ message: "Not authorized, token failed" });
      } else {
        res.json({ message: error.message || "Not authorized" });
      }
    }
  } else if (!token) {
    res.status(401);
    res.json({ message: "Not authorized, no token" });
  }
};
