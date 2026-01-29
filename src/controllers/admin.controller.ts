import type { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Task } from "../models/Task.model";
import { User } from "../models/User.model";
import { UserRole, type AuthRequest } from "../types";

export const getAdminStats = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const [taskStats, userCount] = await Promise.all([
      Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      User.countDocuments({ role: UserRole.USER }),
    ]);

    const stats = {
      totalUsers: userCount,
      todo: taskStats.find((s) => s._id === "todo")?.count || 0,
      inProgress: taskStats.find((s) => s._id === "in_progress")?.count || 0,
      completed: taskStats.find((s) => s._id === "completed")?.count || 0,
    };

    res.status(200).json({ success: true, stats });
  },
);
