import { Router } from "express";
import authRouter from "./auth/routes.js";
import pocRouter from "./poc/routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/poc", pocRouter);

export default router;
