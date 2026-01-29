import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  status: z
    .enum(["todo", "in_progress", "completed"], "")
    .optional()
    .default("todo"),
  assignedTo: z
    .string("Assignee is required")
    .min(1, "Please select a user to assign this task"),

  createdBy: z.string("Creator is required").min(1, "Creator ID is missing"),
  dueDate: z.coerce.date("Invalid date format"),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskFilterSchema = z.object({
  status: z
    .enum(["todo", "in_progress", "completed"], "Invalid Status")
    .optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "completed"], "Invalid Status"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
