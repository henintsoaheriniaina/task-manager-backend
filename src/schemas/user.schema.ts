import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string("Name must be a string")
    .min(2, "Name must be at least 2 characters")
    .max(50),
  email: z.email("Please provide a valid email"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"], "Invalid user role").optional(),
  profile: z.string("Profile is required"),
});
export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.email().optional(),
  role: z.enum(["admin", "user"]).optional(),
  profile: z.string("Profile must be a string").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string("Current password is required")
    .min(1, "Current password is required"),
  newPassword: z
    .string("New password is required")
    .min(8, "New password must be at least 8 characters"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
