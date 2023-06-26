import { Router } from "express";
import invitesRouter from "../invites/routes.js";
import organizationsRouter from "../organizations/routes.js";
import schoolsRouter from "../schools/routes.js";
import roomsRouter from "../rooms/routes.js";

const router = Router();

router.use("/invite", invitesRouter);
router.use("/organization", organizationsRouter);
router.use("/school", schoolsRouter);
router.use("/rooms", roomsRouter);

export default router;
