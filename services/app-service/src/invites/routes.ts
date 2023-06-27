import { Request, Response, Router } from "express";
import { body, check, param } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import { createInvite, redeemInvite, validateInviteRights } from "./service.js";

import { sendInviteEmail } from "../cio/service.js";
import dbClient from "../utils/prisma.js";
import { signupValidation } from "../auth/routes.js";
import { GradeYear, PermissionType } from "@prisma/client";

const router = Router();

// Invites routes are nested under /admin/
// TODO Ryan: Add nested permissions to contract
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
  "/invite",
  requireAuth,
  [
    body("firstName").isString(),
    body("lastName").isString(),
    body("gradeYear").isString().optional(),
    body("email").isString(),
    body("role").isString().optional(),
    check("permissions.*.type").isString(),
    check("permissions.*.organizationId").isString().optional(),
    check("permissions.*.schoolId").isString().optional(),
    check("permissions.*.roomId").isString().optional(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const body = req.body as CreateInviteBody;

    // Validate the admin can invite for the given permissions
    const validatePermissionsPromises = [];
    for (const permission of req.body.permissions) {
      validatePermissionsPromises.push(
        validateInviteRights({
          userId: session.userId as string,
          organizationId: permission.organizationId,
          schoolId: permission.schoolId,
          roomId: permission.roomId,
        })
      );
    }
    await Promise.all(validatePermissionsPromises);

    // Create invite
    const newInvite = await createInvite({
      firstName: body.firstName,
      lastName: body.lastName,
      gradeYear: body.gradeYear as GradeYear | undefined,
      email: body.email,
      permissions: {
        create: body.permissions.map((permission) => ({
          type: permission.type as PermissionType,
          organizationId: permission.organizationId,
          schoolId: permission.schoolId,
          roomId: permission.roomId,
        })),
      },
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

// Unauthenticated route for accepting an invite
router.get("/:inviteId", async (req: Request, res: Response) => {
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
  if (new Date(invite.createdAt).getTime() < Date.now() - 48 * 60 * 60 * 1000) {
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
    invite,
  });
});

router.post(
  "/:inviteId/redeem",
  [...signupValidation, param("inviteId").isString()],
  async (req: Request, res: Response) => {
    // Get invite
    const newUser = await redeemInvite({
      inviteId: req.params.inviteId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      receivePromotions: req.body.receivePromotions,
    });

    // Create session
    const session = req.session;
    session.userId = newUser.id;
    session.save();
    // Send user
    res.status(201).send({
      user: newUser,
    });
  }
);

export default router;
