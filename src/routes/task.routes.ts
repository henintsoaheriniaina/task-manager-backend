import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate, validateQuery } from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  taskFilterSchema,
  updateTaskSchema,
} from "../schemas/task.schema";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(validateQuery(taskFilterSchema), getTasks)
  .post(validate(createTaskSchema), createTask);

router
  .route("/:id")
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
