import { AppUser } from "../models/User";

declare global {
  // Augment the Express namespace
  namespace Express {
    interface Request {
      // Add a 'user' property to the Request object
      appUser?: AppUser;
    }
  }
}

export {};
