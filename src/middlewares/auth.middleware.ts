import { type NextFunction, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { type AuthRequest, UserRole } from "../types";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

export const protect = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw ApiError.unauthorized("Not authorized to access this route");
    }

    try {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired token");
    }
  },
);

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden("Not authorized to access this resource");
    }
    next();
  };
};
