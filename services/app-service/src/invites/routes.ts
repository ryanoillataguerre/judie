import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import { BulkInviteBody, bulkInvite, invite, redeemInvite } from "./service.js";

import dbClient from "../utils/prisma.js";
import { signupValidation } from "../auth/routes.js";
import { setUserSessionId } from "../auth/service.js";
import { sendInviteEmail } from "../cio/service.js";

const router = Router();

// Invites routes are nested under /admin/
export interface CreateInviteBody {
  gradeYear: string;
  email: string;
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
  [
    param("inviteId").isString(),
    body("firstName").isString().optional(),
    body("lastName").isString().optional(),
    body("password").isString().exists(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    // Get invite
    const newUser = await redeemInvite({
      inviteId: req.params.inviteId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
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
  requireAuth,
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

router.post(
  "/:inviteId/resend",
  [param("inviteId").isString()],
  requireAuth,
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    // Get invite by ID
    const invite = await dbClient.invite.findUnique({
      where: {
        id: req.params.inviteId,
      },
    });
    if (!invite) {
      res.status(404).send({
        error: "Invite not found",
      });
      return;
    }
    // Resend invite
    await sendInviteEmail({
      invite,
    });
    res.status(200).send({
      data: invite,
    });
  })
);

export default router;
