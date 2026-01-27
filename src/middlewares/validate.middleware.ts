import { type NextFunction, type Request, type Response } from "express";
import { type ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          formattedErrors[path] = issue.message;
        });
        const apiError = ApiError.badRequest(JSON.stringify(formattedErrors));
        next(apiError);
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        next(ApiError.badRequest(messages));
      } else {
        next(error);
      }
    }
  };
};
