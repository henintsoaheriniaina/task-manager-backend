import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { authorize, protect } from "../middlewares/auth.middleware";
import { validate, validateQuery } from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  taskFilterSchema,
  updateTaskSchema,
} from "../schemas/task.schema";
import { UserRole } from "../types";

const router = Router();

router.use(protect);
router.use(authorize(UserRole.ADMIN));

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
