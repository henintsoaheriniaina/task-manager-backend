import { addDays, endOfDay, startOfDay } from "date-fns";
import { type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Task } from "../models/Task.model";
import type { UpdateStatusInput } from "../schemas/task.schema";
import { type AuthRequest } from "../types";
import { ApiError } from "../utils/ApiError";

export const getMyTasks = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tasks = await Task.find({ assignedTo: req.user!.id })
      .select("-createdBy")
      .populate("assignedTo", "name email profile")
      .sort({ dueDate: 1 });

    res.status(200).json({ success: true, tasks });
  },
);

export const getTodayTasks = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const today = {
      $gte: startOfDay(new Date()),
      $lte: endOfDay(new Date()),
    };

    const tasks = await Task.find({
      $or: [{ assignedTo: req.user!.id }],
      dueDate: today,
    }).populate("assignedTo", "name email profile");

    res.status(200).json({ success: true, tasks });
  },
);

export const getUpcomingTasks = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tomorrow = startOfDay(addDays(new Date(), 1));

    const tasks = await Task.find({
      $or: [{ assignedTo: req.user!.id }],
      dueDate: { $gte: tomorrow },
    })
      .populate("assignedTo", "name email profile")
      .sort({ dueDate: 1 });
    res.status(200).json({ success: true, tasks });
  },
);

export const updateMyTaskStatus = expressAsyncHandler(
  async (
    req: AuthRequest<{ id: string }, {}, UpdateStatusInput>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      throw ApiError.notFound("Task not found");
    }
    if (task.assignedTo?.toString() !== req.user!.id) {
      throw ApiError.forbidden("You can only update tasks assigned to you");
    }
    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      task,
    });
  },
);
