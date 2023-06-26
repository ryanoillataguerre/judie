import { Router } from "express";
import invitesRouter from "../invites/routes.js";

const router = Router();

router.use("/invite", invitesRouter);

export default router;
