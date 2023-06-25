import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import { validateInviteRights } from "./service.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    // TODO: Common fetch function for admin viewing of users
    res.status(200).json({});
  })
);

router.post(
  "/invite",
  requireAuth,
  [
    body("firstName").isString(),
    body("lastName").isString(),
    body("gradeYear").isString(),
    body("email").isString(),
    body("organizationId").isString().optional(),
    body("schoolId").isString().optional(),
    body("roomId").isString().optional(),
    body("role").isString(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    // Validate the admin can invite for the given level
    await validateInviteRights({
      userId: session.userId as string,
      organizationId: req.body.organizationId,
      schoolId: req.body.schoolId,
      roomId: req.body.roomId,
    });
    // TODO: Create invite
    // TODO: Send invite email
  })
);

export default router;
