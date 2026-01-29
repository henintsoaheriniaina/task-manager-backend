import bcrypt from "bcryptjs";
import mongoose, { Model, Schema } from "mongoose";
import { type IUser, UserRole } from "../types";

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    profile: {
      type: String,
      required: [true, "Profile is required"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.virtual("assignedTasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "assignedTo",
});

userSchema.virtual("createdTasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "createdBy",
});
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
