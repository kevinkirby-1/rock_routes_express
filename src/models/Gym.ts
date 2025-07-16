import mongoose, { Document, Schema, ObjectId } from "mongoose";
import { AppUser } from "./User";

export interface ClimbingGymI extends Document {
  _id: ObjectId;
  name: string;
  img?: string;
  address?: string;
  description?: string;
  isIndoor: string;
  user: ObjectId | AppUser;
}

const GymSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a gym name"],
    },
    img: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isIndoor: {
      type: Boolean,
      required: true,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create and export model
const ClimbingGym = mongoose.model<ClimbingGymI>("ClimbingGym", GymSchema);

export default ClimbingGym;
