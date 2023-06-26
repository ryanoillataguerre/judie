import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import { createInvite, validateInviteRights } from "./service.js";

import { sendInviteEmail } from "../cio/service.js";

const router = Router();

// Invites routes are nested under /admin/
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
    // Create invite
    const newInvite = await createInvite({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gradeYear: req.body.gradeYear,
      email: req.body.email,
      role: req.body.role,
      ...(req.body.organizationId
        ? {
            organization: {
              connect: {
                id: req.body.organizationId,
              },
            },
          }
        : {}),
      ...(req.body.schoolId
        ? {
            school: {
              connect: {
                id: req.body.schoolId,
              },
            },
          }
        : {}),
      ...(req.body.roomId
        ? {
            room: {
              connect: {
                id: req.body.roomId,
              },
            },
          }
        : {}),
    });
    // Send invite email
    await sendInviteEmail({
      invite: newInvite,
    });

    res.status(201).send({
      invite: newInvite,
    });
  })
);

export default router;
