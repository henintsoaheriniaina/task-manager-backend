import { Router } from "express";
import {
  changePassword,
  getMyTasks,
  getTodayTasks,
  getUpcomingTasks,
  updateMyTaskStatus,
  updateProfile,
} from "../controllers/accessible.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateStatusSchema } from "../schemas/task.schema";
import { changePasswordSchema, updateUserSchema } from "../schemas/user.schema";

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
router.patch("/profile/update", validate(updateUserSchema), updateProfile);

router.patch(
  "/profile/change-password",
  validate(changePasswordSchema),
  changePassword,
);

export default router;
