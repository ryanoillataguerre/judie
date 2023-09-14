import { Router } from "express";
import authRouter from "./auth/routes.js";
import chatRouter from "./chats/routes.js";
import userRouter from "./users/routes.js";
import paymentsRouter from "./payments/routes.js";
import adminRoutes from "./admin/routes.js";
import invitesRouter from "./invites/routes.js";
import messagesRouter from "./messages/routes.js";
import foldersRouter from "./folders/routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);
router.use("/payments", paymentsRouter);
router.use("/invites", invitesRouter);
router.use("/messages", messagesRouter);
// Admin - can be migrated to a new service?
router.use("/admin", adminRoutes);
router.use("/folders", foldersRouter);

export default router;
