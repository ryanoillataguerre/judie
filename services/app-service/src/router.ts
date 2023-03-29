import { Router } from "express";
import authRouter from "./auth/routes.js";
import chatRouter from "./chat/routes.js";
import userRouter from "./user/routes.js";
const router = Router();

router.use("/auth", authRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);

export default router;
