import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profile: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: ObjectId | IUser;
  createdBy: ObjectId | IUser;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
