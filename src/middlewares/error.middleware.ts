import { type NextFunction, type Request, type Response } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message =
      env.NODE_ENV === "production" ? "Internal server error" : error.message;
    error = new ApiError(statusCode, message, false);
  }

  const apiError = error as ApiError;

  const response = {
    success: false,
    message: apiError.message,
    ...(env.NODE_ENV === "development" && { stack: apiError.stack }),
  };

  if (env.NODE_ENV === "development") {
    console.error("Error:", {
      message: apiError.message,
      statusCode: apiError.statusCode,
      stack: apiError.stack,
    });
  }

  res.status(apiError.statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
