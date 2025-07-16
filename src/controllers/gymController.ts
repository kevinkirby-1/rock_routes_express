import { Request, Response } from "express";
import ClimbingGym, { ClimbingGymI } from "../models/Gym";
import mongoose from "mongoose";

// Create new climbing gym
export const createGym = async (req: Request, res: Response) => {
  const { name, img, address, description, isIndoor } = req.body;

  // Validation
  if (!name) {
    return res
      .status(400)
      .json({ message: "Please include all required gym fields" });
  }

  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Add gym to db
    const newGym = await ClimbingGym.create({
      user: req.appUser._id,
      name,
      img,
      address,
      description,
      isIndoor,
    });

    res.status(201).json(newGym);
  } catch (error: any) {
    // Adding to db failed
    console.error(`Error creating gym: ${error.message}`);

    // Handle Mongoose errors
    if (error.name === "ValidationError") {
      const errors: { [key: string]: string } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.error[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error creating gym" });
  }
};

// Get all gyms for one user
export const getGyms = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Fetch gyms from db
  try {
    const gyms = await ClimbingGym.find({ user: req.appUser._id });

    res.status(200).json(gyms);
  } catch (error: any) {
    // Fetching gyms failed
    console.error(`Error fetching gyms: ${error.message}`);
    res.status(500).json({ message: "Server error fetching gyms" });
  }
};

// Get a single climbing gym by ID
export const getGymById = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if gym id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid gym ID" });
  }

  try {
    // Get gym from db
    const gym = await ClimbingGym.findById(req.params.id);

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
  } catch (error: any) {
    // Fetching from db failed
    console.error(`Error fetching gym by ID: ${error.message}`);
    res.status(500).json({ message: "Server error fetching gym" });
  }
};

// Update a climbing gym
export const updateGym = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if gym id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid gym ID" });
  }

  try {
    // Get gym from db
    let gym = await ClimbingGym.findById(req.params.id);

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
    const updatedGym = (await ClimbingGym.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )) as ClimbingGymI;

    res.status(200).json(updatedGym);
  } catch (error: any) {
    // Updating db failed
    console.error(`Error updating gym: ${error.message}`);

    // Handle mongoose errors
    if (error.name === "ValidationError") {
      const errors: { [key: string]: string } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error updating gym" });
  }
};

// Delete a climbing gym
export const deleteGym = async (req: Request, res: Response) => {
  // Check if user is authenticated
  if (req.appUser?._id === undefined) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Check if gym id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid gym ID" });
  }

  try {
    // Get gym from db
    const gym = await ClimbingGym.findById(req.params.id);

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
    await ClimbingGym.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Gym removed" });
  } catch (error: any) {
    // Deleting route failed
    console.error(`Error deleting gym: ${error.message}`);
    res.status(500).json({ message: "Server error deleting gym" });
  }
};
