import { type NextFunction, type Request, type Response } from "express";
import { type ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

const validateWithZod =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.log(`err : ${result.error}`);
      res.status(400);
      throw new Error(`Validation error : ${result.error}`);
    }
    req.body = result.data;
    next();
  };
export default validateWithZod;

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
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
        const messages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        next(ApiError.badRequest(messages));
      } else {
        next(error);
      }
    }
  };
};
