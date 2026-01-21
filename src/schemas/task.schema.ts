import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z
    .enum(["todo", "in_progress", "completed"])
    .optional()
    .default("todo"),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(5).optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export const taskFilterSchema = z.object({
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
