"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = exports.googleAuth = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
const registerUser = async (req, res) => {
    const { given_name, family_name, name, email, password } = req.body;
    try {
        // Check if email already associated with user
        let user = await User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Add new user to db
        user = await User_1.default.create({
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
    }
    catch (error) {
        // Adding new user to db failed
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if email exists on a user
        const user = await User_1.default.findOne({ email }).select("+password");
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
    }
    catch (error) {
        // Loggin in user failed
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.loginUser = loginUser;
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your backend's Google Client ID
const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload(); // Get verified user information
        const { sub, email, name, given_name, family_name, picture } = payload; // 'sub' is Google's unique user ID
        // Find or create user in your own database
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = await User_1.default.create({
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
    }
    catch (error) {
        console.error("Google Auth Error:", error.message);
        res
            .status(401)
            .json({ message: "Google authentication failed. Invalid token." });
    }
};
exports.googleAuth = googleAuth;
const getUserData = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    res.status(200).json(req.appUser);
};
exports.getUserData = getUserData;
