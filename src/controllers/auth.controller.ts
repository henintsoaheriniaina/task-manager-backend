import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { User } from "../models/User.model";
import { type LoginInput, type RegisterInput } from "../schemas/auth.schema";
import { type AuthRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { generateToken, sendTokenResponse } from "../utils/jwt";

export const register = expressAsyncHandler(
  async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), user.email, user.role);

    sendTokenResponse(res, 201, token, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },
);

export const login = expressAsyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    sendTokenResponse(res, 200, token, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },
);

export const logout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
);

export const getMe = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!.id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  },
);
