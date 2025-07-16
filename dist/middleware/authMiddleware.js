"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Confirm if user is logged in
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.appUser = (await User_1.default.findById(decoded.id)
                .select("-password")
                .lean());
            if (!req.appUser) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            if (error.name === "TokenExpiredError") {
                res.json({ message: "Not authorized, token expired" });
            }
            else if (error.name === "JsonWebTokenError") {
                res.json({ message: "Not authorized, token failed" });
            }
            else {
                res.json({ message: error.message || "Not authorized" });
            }
        }
    }
    else if (!token) {
        res.status(401);
        res.json({ message: "Not authorized, no token" });
    }
};
exports.protect = protect;
