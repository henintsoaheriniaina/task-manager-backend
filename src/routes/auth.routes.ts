import { Router } from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller";

import { protect } from "../middlewares/auth.middleware";
import validateWithZod from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateWithZod(registerSchema), register);
router.post("/login", validateWithZod(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
