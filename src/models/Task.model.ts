import mongoose, { Model, Schema } from "mongoose";
import { type ITask, TaskStatus } from "../types";

interface ITaskModel extends Model<ITask> {}

const taskSchema = new Schema<ITask, ITaskModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters"],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ status: 1, createdBy: 1 });
taskSchema.index({ assignedTo: 1 });

export const Task = mongoose.model<ITask, ITaskModel>("Task", taskSchema);
