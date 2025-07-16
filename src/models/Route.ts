import mongoose, { Document, Schema, ObjectId } from "mongoose";
import { AppUser } from "./User";

export interface ClimbingRouteI extends Document {
  _id: ObjectId;
  name: string;
  img?: string;
  grade: string;
  difficulty: number;
  gradeSystem: string;
  isProject: boolean;
  gym: ObjectId;
  protection?: string;
  setter?: string;
  dateSet?: Date;
  holdType?: string;
  holdColor?: string;
  attributes?: string[];
  notes?: string;
  attempts: number;
  mostRecentAttempt?: Date;
  isComplete: boolean;
  dateComplete?: Date;
  user: ObjectId | AppUser;
}

const RouteSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a route name"],
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
    grade: {
      type: String,
      required: [true, "Please add a route grade"],
      trim: true,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    gradeSystem: {
      type: String,
      required: true,
      trim: true,
    },
    isProject: {
      type: Boolean,
      required: true,
      default: false,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Gym",
    },
    protection: {
      type: String,
      trim: true,
    },
    setter: {
      type: String,
      trim: true,
    },
    dateSet: {
      type: Date,
    },
    holdType: {
      type: String,
      trim: true,
    },
    holdColor: {
      type: String,
      trim: true,
    },
    attributes: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
    mostRecentAttempt: {
      type: Date,
    },
    dateComplete: {
      type: Date,
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
const ClimbingRoute = mongoose.model<ClimbingRouteI>(
  "ClimbingRoute",
  RouteSchema
);

export default ClimbingRoute;