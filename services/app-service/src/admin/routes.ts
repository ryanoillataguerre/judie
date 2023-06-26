import { Router } from "express";
import invitesRouter from "../invites/routes.js";
import organizationsRouter from "../organizations/routes.js";

const router = Router();

router.use("/invite", invitesRouter);
router.use("/organization", organizationsRouter);

export default router;
