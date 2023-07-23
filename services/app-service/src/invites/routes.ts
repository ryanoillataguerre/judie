import { Request, Response, Router } from "express";
import { body, check, param } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  BulkInviteBody,
  bulkInvite,
  createInvite,
  invite,
  redeemInvite,
  validateInviteRights,
} from "./service.js";

import { sendInviteEmail } from "../cio/service.js";
import dbClient from "../utils/prisma.js";
import { signupValidation } from "../auth/routes.js";
import { GradeYear, PermissionType } from "@prisma/client";
import BadRequestError from "../utils/errors/BadRequestError.js";
import moment from "moment";
import { setUserSessionId } from "../auth/service.js";

const router = Router();

// Invites routes are nested under /admin/
export interface CreateInviteBody {
  firstName: string;
  lastName: string;
  gradeYear: string;
  email: string;
  role?: string;
  permissions: {
    type: string;
    organizationId?: string;
    schoolId?: string;
    roomId?: string;
  }[];
}
router.post(
  "/",
  requireAuth,
  [
    body("gradeYear").isString().optional(),
    body("email").isString(),
    body("permissions.*.type").isString(),
    body("permissions.*.organizationId").isString().optional(),
    body("permissions.*.schoolId").isString().optional(),
    body("permissions.*.roomId").isString().optional(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const body = req.body as CreateInviteBody;

    const newInvite = await invite({
      ...body,
      userId: session.userId as string,
    });

    res.status(201).send({
      invite: newInvite,
    });
  })
);

// Unauthenticated route for accepting an invite
router.get(
  "/:inviteId",
  errorPassthrough(async (req: Request, res: Response) => {
    const inviteId = req.params.inviteId;
    // Get invite
    const invite = await dbClient.invite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        organization: true,
        school: true,
        room: true,
      },
    });
    if (!invite || invite.deletedAt) {
      res.status(404).send({
        error: "Invite not found",
      });
      return;
    }
    // If >48hr old, delete
    if (
      new Date(invite.createdAt).getTime() <
      Date.now() - 48 * 60 * 60 * 1000
    ) {
      await dbClient.invite.update({
        where: {
          id: invite.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      res.status(404).send({
        error: "Invite not found",
      });
      return;
    }
    res.status(200).send({
      data: invite,
    });
  })
);

router.post(
  "/:inviteId/redeem",
  [...signupValidation, param("inviteId").isString()],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    // Get invite
    const newUser = await redeemInvite({
      inviteId: req.params.inviteId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      role: req.body.role,
      receivePromotions: req.body.receivePromotions,
    });

    // Create session
    const session = req.session;
    session.userId = newUser?.id;
    session.save();
    await setUserSessionId({
      userId: newUser.id,
      sessionId: session.id,
    });
    // Send user
    res.status(201).send({
      data: newUser,
    });
  })
);

const bulkInviteValidation = [
  body("organizationId").isString().exists(),
  body("invites.*.email").isString(),
  body("invites.*.role").isString().exists(),
  body("invites.*.school").isString().optional(),
  body("invites.*.classroom").isString().optional(),
];
router.post(
  "/bulk",
  bulkInviteValidation,
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const body = req.body as BulkInviteBody;

    const invites = await bulkInvite({
      ...body,
      userId: session.userId as string,
    });

    res.status(201).send({
      data: invites,
    });
  })
);

export default router;
