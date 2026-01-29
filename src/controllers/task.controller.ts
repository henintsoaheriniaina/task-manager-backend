import { type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Task } from "../models/Task.model";
import {
  type CreateTaskInput,
  type TaskFilterInput,
  type UpdateTaskInput,
} from "../schemas/task.schema";
import { type AuthRequest, UserRole } from "../types";
import { ApiError } from "../utils/ApiError";

export const createTask = expressAsyncHandler(
  async (req: AuthRequest<{}, {}, CreateTaskInput>, res: Response) => {
    const { description, dueDate, status, title, assignedTo, createdBy } =
      req.body;
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      createdBy,
      assignedTo,
    });

    const populated = await Task.findOne(task._id)
      .populate("createdBy", "name email profile role")
      .populate("assignedTo", "name email profile role");
    res.status(201).json({
      success: true,
      task: populated,
    });
  },
);

export const getTasks = expressAsyncHandler(
  async (req: AuthRequest<{}, {}, {}, TaskFilterInput>, res: Response) => {
    const { status, assignedTo, createdBy } = req.query;

    let query: any = {};

    if (req.user!.role === UserRole.USER) {
      query.$or = [{ createdBy: req.user!.id }, { assignedTo: req.user!.id }];
    }

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (createdBy) query.createdBy = createdBy;

    const tasks = await Task.find(query)

      .populate("createdBy", "name email profile role")
      .populate("assignedTo", "name email profile role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  },
);

export const getTaskById = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email profile role")
      .populate("assignedTo", "name email profile role");
    if (!task) {
      throw ApiError.notFound("Task not found");
    }
    res.status(200).json({
      success: true,
      task,
    });
  },
);

export const updateTask = expressAsyncHandler(
  async (
    req: AuthRequest<{ id: string }, {}, UpdateTaskInput>,
    res: Response,
  ) => {
    let task = await Task.findById(req.params.id);

    if (!task) {
      throw ApiError.notFound("Task not found");
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email profile role")
      .populate("assignedTo", "name email profile role");

    res.status(200).json({
      success: true,
      task,
    });
  },
);

export const deleteTask = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw ApiError.notFound("Task not found");
    }
    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  },
);
