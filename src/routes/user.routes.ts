import { Router } from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller";
import { authorize, protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";
import { UserRole } from "../types";

const router = Router();

router.use(protect);

router.get("/", authorize(UserRole.ADMIN), getAllUsers);
router.post(
  "/",
  authorize(UserRole.ADMIN),
  validate(createUserSchema),
  createUser,
);
router.get("/:id", getUserById);
router.put(
  "/:id",
  authorize(UserRole.ADMIN),
  validate(updateUserSchema),
  updateUser,
);
router.delete("/:id", authorize(UserRole.ADMIN), deleteUser);
router.put(
  "/me/change-password",
  validate(changePasswordSchema),
  changePassword,
);

export default router;
