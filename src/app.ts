import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { initializePassport } from "./config/passport";

import { protect } from "./middleware/authMiddleware"; // remove if never used
import authRoutes from "./routes/authRoutes";
import routeRoutes from "./routes/routeRoutes";
import gymRoutes from "./routes/gymRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// This is needed for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: process.env.NODE_ENV === 'production', // Set in production with HTTPS
      // httpOnly: true, // Recommended for security
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Initialize Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Public Authentication Routes
app.use("/rockroutes/auth", authRoutes);

// Protected Routes
app.use("/rockroutes/routes", routeRoutes);
app.use("/rockroutes/gyms", gymRoutes);

// Basic error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

export default app;
