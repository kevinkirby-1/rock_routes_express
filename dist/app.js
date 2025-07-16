"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_2 = require("./config/passport");
const authMiddleware_1 = require("./middleware/authMiddleware"); // remove if never used
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const routeRoutes_1 = __importDefault(require("./routes/routeRoutes"));
const gymRoutes_1 = __importDefault(require("./routes/gymRoutes"));
const authController_1 = require("./controllers/authController");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// This is needed for passport
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true, // Recommended for security
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
// Initialize Passport
(0, passport_2.initializePassport)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Public Authentication Routes
app.use("/rockroutes/auth", authRoutes_1.default);
// Protected Routes
// Get User Data
app.get("/rockroutes/user", authMiddleware_1.protect, authController_1.getUserData);
app.use("/rockroutes/routes", routeRoutes_1.default);
app.use("/rockroutes/gyms", gymRoutes_1.default);
// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
exports.default = app;
