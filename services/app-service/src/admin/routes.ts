import { Router, Request, Response, NextFunction } from "express";
import invitesRouter from "../invites/routes.js";
import organizationsRouter from "../organizations/routes.js";
import schoolsRouter from "../schools/routes.js";
import roomsRouter from "../rooms/routes.js";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import {
  getEntitiesForUser,
  getUserAdmin,
  getUsersForAdminUser,
} from "./service.js";

// Admin Router
const router = Router();

router.use("/invites", invitesRouter);
router.use("/organizations", organizationsRouter);
router.use("/schools", schoolsRouter);
router.use("/rooms", roomsRouter);

// Root /admin routes
// Get all entities for admin user (orgs, schools, rooms)
router.get(
  "/entities",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const entities = await getEntitiesForUser({
      id: req.session.userId as string,
    });
    res.status(200).send({
      data: entities,
    });
  })
);

// Get all users for admin user
router.get(
  "/users",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const users = await getUsersForAdminUser({
      id: req.session.userId as string,
    });
    res.status(200).send({
      data: users,
    });
  })
);

// Admin/users router
const adminUserRouter = Router();
adminUserRouter.get(
  "/:userId",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    // TODO Ryan: Validate current user can view this user
    const session = req.session;
    const user = await getUserAdmin({ id: req.params.userId as string });

    res.status(200).send({
      data: user,
    });
  })
);

router.use("/users", adminUserRouter);

export default router;
