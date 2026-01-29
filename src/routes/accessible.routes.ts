import { Router } from "express";
import {
  getMyTasks,
  getTodayTasks,
  getUpcomingTasks,
  updateMyTaskStatus,
} from "../controllers/accessible.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateStatusSchema } from "../schemas/task.schema";

const router = Router();

router.use(protect);

router.get("/my-tasks", getMyTasks);
router.get("/upcoming", getUpcomingTasks);
router.get("/today", getTodayTasks);
router.patch(
  "/my-tasks/:id/status",
  validate(updateStatusSchema),
  updateMyTaskStatus,
);

export default router;
