"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markComplete = exports.toggleProjectStatus = exports.logAttempt = exports.deleteRoute = exports.updateRoute = exports.getRouteById = exports.getRoutes = exports.createRoute = void 0;
const Route_1 = __importDefault(require("../models/Route"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create new climbing route
const createRoute = async (req, res) => {
    var _a;
    const { name, img, grade, difficulty, gradeSystem, isProject, gym, protection, setter, dateSet, holdType, holdColor, attributes, notes, attempts, mostRecentAttempt, isComplete, dateComplete, } = req.body;
    // Basic validation
    if (!name || !grade || !gym) {
        return res
            .status(400)
            .json({ message: "Please include all required route fields" });
    }
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        //  Add climbing route to db
        const newRoute = await Route_1.default.create({
            user: req.appUser._id,
            name,
            img,
            grade,
            difficulty,
            gradeSystem,
            isProject,
            gym,
            protection,
            setter,
            dateSet,
            holdType,
            holdColor,
            attributes,
            notes,
            attempts: attempts !== null && attempts !== void 0 ? attempts : 0,
            mostRecentAttempt: mostRecentAttempt !== null && mostRecentAttempt !== void 0 ? mostRecentAttempt : undefined,
            isComplete: isComplete !== null && isComplete !== void 0 ? isComplete : false,
            dateComplete: dateComplete !== null && dateComplete !== void 0 ? dateComplete : undefined,
        });
        res.status(201).json(newRoute);
    }
    catch (error) {
        // Adding to db failed
        console.error(`Error creating route: ${error.message}`);
        // Handle Mongoose errors
        if (error.name === "ValidationError") {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Validation failed", errors });
        }
        res.status(500).json({ message: "Server error creating route" });
    }
};
exports.createRoute = createRoute;
// Get all routes for one user
const getRoutes = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res
            .status(401)
            .json({ message: "User not authenticated trying to get all routes." });
    }
    // Add climbing route to db
    try {
        const routes = await Route_1.default.find({ user: req.appUser._id });
        res.status(200).json(routes);
    }
    catch (error) {
        // Adding to db failed
        console.error(`Error fetching routes: ${error.message}`);
        res.status(500).json({ message: "Server error fetching routes" });
    }
};
exports.getRoutes = getRoutes;
// Get a single climbing route by ID
const getRouteById = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if route id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid route ID" });
    }
    try {
        // Get route from db
        const route = await Route_1.default.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        // Ensure the route belongs to the authenticated user
        if (route.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to view this route" });
        }
        res.status(200).json(route);
    }
    catch (error) {
        // Fetching from db failed
        console.error(`Error fetching route by ID: ${error.message}`);
        res.status(500).json({ message: "Server error fetching route" });
    }
};
exports.getRouteById = getRouteById;
// Update a climbing route
const updateRoute = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if route id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid route ID" });
    }
    try {
        // Get route from db
        let route = await Route_1.default.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        // Ensure the route belongs to the authenticated user
        if (route.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this route" });
        }
        // Store new route without uncessesary data
        const updateData = { ...req.body };
        delete updateData.user;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        // Update route
        const updatedRoute = (await Route_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }));
        res.status(200).json(updatedRoute);
    }
    catch (error) {
        // Updating db failed
        console.error(`Error updating route: ${error.message}`);
        // Handle mongoose errors
        if (error.name === "ValidationError") {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Validation failed", errors });
        }
        res.status(500).json({ message: "Server error updating route" });
    }
};
exports.updateRoute = updateRoute;
// Delete a climbing route
const deleteRoute = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if route id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid route ID" });
    }
    try {
        // Get route from db
        const route = await Route_1.default.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        // Ensure the route belongs to the authenticated user
        if (route.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this route" });
        }
        // Delete route
        await Route_1.default.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Route removed" });
    }
    catch (error) {
        // Deleting route failed
        console.error(`Error deleting route: ${error.message}`);
        res.status(500).json({ message: "Server error deleting route" });
    }
};
exports.deleteRoute = deleteRoute;
// Log an attempt on a route
const logAttempt = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if route id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid route ID" });
    }
    try {
        const route = await Route_1.default.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        if (route.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this route" });
        }
        route.attempts += 1;
        route.mostRecentAttempt = new Date();
        await route.save();
        res.status(200).json(route);
    }
    catch (error) {
        console.error(`Error logging attempt: ${error.message}`);
        res.status(500).json({ message: "Server error logging attempt" });
    }
};
exports.logAttempt = logAttempt;
// Toggle a route's project status
const toggleProjectStatus = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if route id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid route ID" });
    }
    try {
        const route = await Route_1.default.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        if (route.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this route" });
        }
        route.isProject = !route.isProject;
        await route.save();
        res.status(200).json(route);
    }
    catch (error) {
        console.error(`Error toggling project status: ${error.message}`);
        res.status(500).json({ message: "Server error toggling project status" });
    }
};
exports.toggleProjectStatus = toggleProjectStatus;
// Mark a route as complete
const markComplete = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if route id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid route ID" });
    }
    try {
        // Get route
        const route = await Route_1.default.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        if (route.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this route" });
        }
        if (!route.isComplete) {
            // Only update if not already complete
            route.isComplete = true;
            route.isProject = false; // A completed route is no longer a project
            route.dateComplete = new Date();
            await route.save();
        }
        res.status(200).json(route);
    }
    catch (error) {
        console.error(`Error marking route complete: ${error.message}`);
        res.status(500).json({ message: "Server error marking route complete" });
    }
};
exports.markComplete = markComplete;
