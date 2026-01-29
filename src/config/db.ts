import mongoose from "mongoose";
import { env } from "./env";
import { seedAdmin } from "./initAdmin";
import { seedTasks } from "./seedTasks";
import { seedUsers } from "./seedUsers";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
    await seedAdmin();
    await seedUsers(20);
    await seedTasks(60);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error);
});
