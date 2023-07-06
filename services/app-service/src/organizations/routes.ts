import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  handleValidationErrors,
  requireAuth,
  requireJudieAuth,
} from "../utils/express.js";
import {
  createOrganization,
  getOrganizationById,
  getUsersForOrganization,
} from "./service.js";
import { validateOrganizationAdmin } from "../admin/service.js";
import dbClient from "../utils/prisma.js";
import { PermissionType } from "@prisma/client";
import { createPermission } from "../permissions/service.js";
import { sendInviteEmail } from "../cio/service.js";
import { createInvite } from "../invites/service.js";
import { getUser, updateUser } from "../users/service.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("primaryContactEmail").isEmail().exists(),
    body("primaryContactFirstName").isString().exists(),
    body("primaryContactLastName").isString().exists(),
  ],
  // Only Judie employees can create organizations
  requireJudieAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const {
      name,
      primaryContactEmail,
      primaryContactFirstName,
      primaryContactLastName,
    } = req.body;
    const { userId } = req.session;
    const organization = await createOrganization({
      name,
      primaryContactEmail,
      creator: {
        connect: {
          id: userId,
        },
      },
    });

    await createPermission({
      type: PermissionType.ORG_ADMIN,
      organization: {
        connect: {
          id: organization.id,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    });

    const user = await getUser({
      email: primaryContactEmail,
    });

    // If user exists, just associate them
    if (user) {
      await createPermission({
        type: PermissionType.ORG_ADMIN,
        organization: {
          connect: {
            id: organization.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      });
    }

    // If user doesn't exist already
    if (!user) {
      // Create invite for primary contact
      const newInvite = await createInvite({
        email: primaryContactEmail,
        firstName: primaryContactFirstName,
        lastName: primaryContactLastName,
        organization: {
          connect: {
            id: organization.id,
          },
        },
      });
      await sendInviteEmail({ invite: newInvite });
    }

    res.status(201).json({
      data: organization,
    });
  }
);

router.get(
  "/:organizationId/users",
  requireAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { userId } = req.session;
    const organizationId = req.params.organizationId;
    await validateOrganizationAdmin({
      userId: userId as string,
      organizationId,
    });
    const users = await getUsersForOrganization({
      id: organizationId,
    });
    res.status(200).send({
      data: users,
    });
  }
);

router.get(
  "/:organizationId",
  requireAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { userId } = req.session;
    const organizationId = req.params.organizationId;
    await validateOrganizationAdmin({
      userId: userId as string,
      organizationId,
    });
    const org = await getOrganizationById({
      id: organizationId,
    });
    res.status(200).send({
      data: org,
    });
  }
);

export default router;
