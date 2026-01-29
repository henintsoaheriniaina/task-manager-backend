import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { User } from "../models/User.model";
import {
  type CreateUserInput,
  type UpdateUserInput,
} from "../schemas/user.schema";
import { UserRole } from "../types";
import { ApiError } from "../utils/ApiError";

export const createUser = expressAsyncHandler(
  async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    const { name, email, password, role, profile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw ApiError.conflict("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile,
      role: role || "user",
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  },
);
export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  },
);

export const getUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("assignedTasks")
      .populate("createdTasks");

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.status(200).json({
      success: true,
      user,
    });
  },
);

export const updateUser = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, UpdateUserInput>, res: Response) => {
    const { name, email, role, profile } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw ApiError.conflict("Email already in use");
      }
    }

    if (name) user.name = name;
    if (profile) user.profile = profile;
    if (email) user.email = email;
    if (role) user.role = role as UserRole;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  },
);

export const deleteUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  },
);
