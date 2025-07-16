"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGym = exports.updateGym = exports.getGymById = exports.getGyms = exports.createGym = void 0;
const Gym_1 = __importDefault(require("../models/Gym"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create new climbing gym
const createGym = async (req, res) => {
    var _a;
    const { name, img, address, description, isIndoor } = req.body;
    // Validation
    if (!name) {
        return res
            .status(400)
            .json({ message: "Please include all required gym fields" });
    }
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        // Add gym to db
        const newGym = await Gym_1.default.create({
            user: req.appUser._id,
            name,
            img,
            address,
            description,
            isIndoor,
        });
        res.status(201).json(newGym);
    }
    catch (error) {
        // Adding to db failed
        console.error(`Error creating gym: ${error.message}`);
        // Handle Mongoose errors
        if (error.name === "ValidationError") {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.error[key].message;
            });
            return res.status(400).json({ message: "Validation failed", errors });
        }
        res.status(500).json({ message: "Server error creating gym" });
    }
};
exports.createGym = createGym;
// Get all gyms for one user
const getGyms = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Fetch gyms from db
    try {
        const gyms = await Gym_1.default.find({ user: req.appUser._id });
        res.status(200).json(gyms);
    }
    catch (error) {
        // Fetching gyms failed
        console.error(`Error fetching gyms: ${error.message}`);
        res.status(500).json({ message: "Server error fetching gyms" });
    }
};
exports.getGyms = getGyms;
// Get a single climbing gym by ID
const getGymById = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if gym id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid gym ID" });
    }
    try {
        // Get gym from db
        const gym = await Gym_1.default.findById(req.params.id);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        // Ensure the gym belongs to the authenticated user
        if (gym.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to view this gym" });
        }
        res.status(200).json(gym);
    }
    catch (error) {
        // Fetching from db failed
        console.error(`Error fetching gym by ID: ${error.message}`);
        res.status(500).json({ message: "Server error fetching gym" });
    }
};
exports.getGymById = getGymById;
// Update a climbing gym
const updateGym = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if gym id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid gym ID" });
    }
    try {
        // Get gym from db
        let gym = await Gym_1.default.findById(req.params.id);
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        // Ensure the gym belongs to the authenticated user
        if (gym.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this gym" });
        }
        // Store new route without uncessesary data
        const updateData = { ...req.body };
        delete updateData.user;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        // Update gym
        const updatedGym = (await Gym_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }));
        res.status(200).json(updatedGym);
    }
    catch (error) {
        // Updating db failed
        console.error(`Error updating gym: ${error.message}`);
        // Handle mongoose errors
        if (error.name === "ValidationError") {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Validation failed", errors });
        }
        res.status(500).json({ message: "Server error updating gym" });
    }
};
exports.updateGym = updateGym;
// Delete a climbing gym
const deleteGym = async (req, res) => {
    var _a;
    // Check if user is authenticated
    if (((_a = req.appUser) === null || _a === void 0 ? void 0 : _a._id) === undefined) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    // Check if gym id is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid gym ID" });
    }
    try {
        // Get gym from db
        const gym = await Gym_1.default.findById(req.params.id);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }
        // Ensure the gym belongs to the authenticated user
        if (gym.user.toString() !== req.appUser._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this gym" });
        }
        // Delete route
        await Gym_1.default.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Gym removed" });
    }
    catch (error) {
        // Deleting route failed
        console.error(`Error deleting gym: ${error.message}`);
        res.status(500).json({ message: "Server error deleting gym" });
    }
};
exports.deleteGym = deleteGym;
