import { Request, Response } from "express";
import ClimbingRoute, { ClimbingRouteI } from "../models/Route";
import mongoose from "mongoose";

// Create new climbing route
export const createRoute = async (req: Request, res: Response) => {
  const {
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
    attempts,
    mostRecentAttempt,
    isComplete,
    dateComplete,
  } = req.body;

  // Basic validation
  if (!name || !grade || !gym) {
    return res
      .status(400)
      .json({ message: "Please include all required route fields" });
  }

  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    //  Add climbing route to db
    const newRoute = await ClimbingRoute.create({
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
      attempts: attempts ?? 0,
      mostRecentAttempt: mostRecentAttempt ?? undefined,
      isComplete: isComplete ?? false,
      dateComplete: dateComplete ?? undefined,
    });

    res.status(201).json(newRoute);
  } catch (error: any) {
    // Adding to db failed
    console.error(`Error creating route: ${error.message}`);

    // Handle Mongoose errors
    if (error.name === "ValidationError") {
      const errors: { [key: string]: string } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error creating route" });
  }
};

// Get all routes for one user
export const getRoutes = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res
      .status(401)
      .json({ message: "User not authenticated trying to get all routes." });
  }

  // Add climbing route to db
  try {
    const routes = await ClimbingRoute.find({ user: req.appUser._id });

    res.status(200).json(routes);
  } catch (error: any) {
    // Adding to db failed
    console.error(`Error fetching routes: ${error.message}`);
    res.status(500).json({ message: "Server error fetching routes" });
  }
};

// Get a single climbing route by ID
export const getRouteById = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if route id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid route ID" });
  }

  try {
    // Get route from db
    const route = await ClimbingRoute.findById(req.params.id);

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
  } catch (error: any) {
    // Fetching from db failed
    console.error(`Error fetching route by ID: ${error.message}`);
    res.status(500).json({ message: "Server error fetching route" });
  }
};

// Update a climbing route
export const updateRoute = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if route id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid route ID" });
  }

  try {
    // Get route from db
    let route = await ClimbingRoute.findById(req.params.id);

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
    const updatedRoute = (await ClimbingRoute.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )) as ClimbingRouteI;

    res.status(200).json(updatedRoute);
  } catch (error: any) {
    // Updating db failed
    console.error(`Error updating route: ${error.message}`);

    // Handle mongoose errors
    if (error.name === "ValidationError") {
      const errors: { [key: string]: string } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error updating route" });
  }
};

// Delete a climbing route
export const deleteRoute = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if route id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid route ID" });
  }

  try {
    // Get route from db
    const route = await ClimbingRoute.findById(req.params.id);

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
    await ClimbingRoute.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Route removed" });
  } catch (error: any) {
    // Deleting route failed
    console.error(`Error deleting route: ${error.message}`);
    res.status(500).json({ message: "Server error deleting route" });
  }
};

// Log an attempt on a route
export const logAttempt = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if route id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid route ID" });
  }

  try {
    const route = await ClimbingRoute.findById(req.params.id);

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
  } catch (error: any) {
    console.error(`Error logging attempt: ${error.message}`);
    res.status(500).json({ message: "Server error logging attempt" });
  }
};

// Toggle a route's project status
export const toggleProjectStatus = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if route id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid route ID" });
  }

  try {
    const route = await ClimbingRoute.findById(req.params.id);

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
  } catch (error: any) {
    console.error(`Error toggling project status: ${error.message}`);
    res.status(500).json({ message: "Server error toggling project status" });
  }
};

// Mark a route as complete
export const markComplete = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if route id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid route ID" });
  }

  try {
    // Get route
    const route = await ClimbingRoute.findById(req.params.id);

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
  } catch (error: any) {
    console.error(`Error marking route complete: ${error.message}`);
    res.status(500).json({ message: "Server error marking route complete" });
  }
};
