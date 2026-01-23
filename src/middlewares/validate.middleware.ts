import { type NextFunction, type Request, type Response } from "express";
import { type ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      // TypeScript a besoin de savoir que 'error' est bien une instance de ZodError
      if (error instanceof ZodError) {
        // .issues est souvent préférable à .errors dans les versions récentes de Zod
        const messages = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        next(ApiError.badRequest(messages));
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
