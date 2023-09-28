import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
  requireJudieAuth,
} from "../utils/express.js";
import {
  createOrganization,
  getInvitesForOrganization,
  getOrganizationById,
  getUsersForOrganization,
  updateOrganization,
} from "./service.js";
import { validateOrganizationAdmin } from "../admin/service.js";
import { PermissionType } from "@prisma/client";
import { createPermission } from "../permissions/service.js";
import { sendInviteEmail } from "../cio/service.js";
import { createInvite } from "../invites/service.js";
import { getUser } from "../users/service.js";

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
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const {
      name,
      primaryContactEmail,
      primaryContactFirstName,
      primaryContactLastName,
    } = req.body;
    const userId = req.userId;
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
      await createPermission({
        type: PermissionType.ORG_ADMIN,
        organization: {
          connect: {
            id: organization.id,
          },
        },
        invite: {
          connect: {
            id: newInvite.id,
          },
        },
      });
      await sendInviteEmail({ invite: newInvite });
    }

    res.status(201).json({
      data: organization,
    });
  })
);

router.put(
  "/:organizationId",
  [body("name").isString().exists()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = req.userId;

    await validateOrganizationAdmin({
      userId: userId as string,
      organizationId: req.params.organizationId,
    });

    const organization = await updateOrganization(req.params.organizationId, {
      name,
    });

    res.status(201).json({
      data: organization,
    });
  })
);

router.get(
  "/:organizationId/users",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
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
  })
);

router.get(
  "/:organizationId",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
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
  })
);

router.get(
  "/:organizationId/invites",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const organizationId = req.params.organizationId;
    await validateOrganizationAdmin({
      userId: userId as string,
      organizationId,
    });
    const users = await getInvitesForOrganization({
      id: organizationId,
    });
    res.status(200).send({
      data: users,
    });
  })
);

export default router;
