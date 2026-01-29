import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  API_URL: z.string().default("http://localhost:8000"),
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  JWT_EXPIRE: z.string().default("7d"),
  COOKIE_EXPIRE: z.string().default("7"),
  FRONTEND_URL: z
    .url("Frontend URL must be a valid URL")
    .default("http://localhost:5173"),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "Admin password must be at least 8 characters"),
  ADMIN_EMAIL: z.email("Admin email must be a valid email address"),
  ADMIN_PROFILE: z.url("Admin profile must be a valid image url"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
