import { Router } from "express";
import authRouter from "./auth/routes.js";
import chatRouter from "./chats/routes.js";
import userRouter from "./users/routes.js";
import paymentsRouter from "./payments/routes.js";
import adminRoutes from "./admin/routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);
router.use("/payments", paymentsRouter);
// Admin - can be migrated to a new service?
router.use("/admin", adminRoutes);

export default router;
