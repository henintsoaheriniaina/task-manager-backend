import { type Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { type TokenPayload, UserRole } from "../types";

export const generateToken = (
  id: string,
  email: string,
  role: UserRole,
): string => {
  return jwt.sign({ id, email, role }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

export const sendTokenResponse = (
  res: Response,
  statusCode: number,
  token: string,
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    profile: string;
  },
) => {
  const isProduction = env.NODE_ENV === "production";
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: isProduction ,
   sameSite: isProduction ? ("none" as const) : ("lax" as const),
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
};
