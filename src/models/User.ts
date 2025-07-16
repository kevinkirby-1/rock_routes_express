import mongoose, { Document, ObjectId, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface AppUser extends Document {
  _id: ObjectId;
  email: string;
  password?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  googleId?: string;
  appleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      trim: true,
    },
    given_name: {
      type: String,
      trim: true,
    },
    family_name: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    appleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<AppUser>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false; // No password to compare if using OAuth
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export model
const AppUser = mongoose.model<AppUser>("AppUser", UserSchema);
export default AppUser;
