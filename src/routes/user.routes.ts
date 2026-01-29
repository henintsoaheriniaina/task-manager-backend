import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller";
import { authorize, protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { UserRole } from "../types";

const router = Router();

router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get("/", getAllUsers);
router.post("/", validate(createUserSchema), createUser);
router.get("/:id", getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
