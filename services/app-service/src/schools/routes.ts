import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  handleValidationErrors,
  requireAuth,
  requireJudieAuth,
} from "../utils/express.js";
import { createSchool, getUsersForSchool } from "./service.js";
import {
  validateOrganizationAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";
import { createPermission } from "../permissions/service.js";
import { PermissionType } from "@prisma/client";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("address").isString().optional(),
    body("organizationId").isString().exists(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, organizationId } = req.body;
    // Validate user has organization-level privileges
    await validateOrganizationAdmin({
      userId: req.session.userId as string,
      organizationId,
    });
    const school = await createSchool({
      name,
      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

    // Create admin permission for creator
    await createPermission({
      type: PermissionType.SCHOOL_ADMIN,
      organization: {
        connect: {
          id: organizationId,
        },
      },
      school: {
        connect: {
          id: school.id,
        },
      },
      user: {
        connect: {
          id: req.session.userId,
        },
      },
    });

    res.status(201).json({
      school,
    });
  }
);

router.get(
  "/:schoolId/users",
  requireAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { userId } = req.session;
    const schoolId = req.params.schoolId;
    await validateSchoolAdmin({
      userId: userId as string,
      schoolId,
    });
    const users = await getUsersForSchool({
      id: schoolId,
    });
    res.status(200).send({
      users,
    });
  }
);

export default router;
