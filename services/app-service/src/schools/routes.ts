import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  createSchool,
  deleteSchoolById,
  getInvitesForSchool,
  getSchoolById,
  getUsersForSchool,
  updateSchool,
} from "./service.js";
import {
  validateOrganizationAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";
import { createPermission } from "../permissions/service.js";
import { PermissionType } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("address").isString().optional(),
    body("organizationId").isString().exists(),
  ],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { name, organizationId, address } = req.body;
    // Validate user has organization-level privileges
    await validateOrganizationAdmin({
      userId: req.userId as string,
      organizationId,
    });
    const school = await createSchool({
      name,
      ...(address && { address }),
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
          id: school.organizationId,
        },
      },
      school: {
        connect: {
          id: school.id,
        },
      },
      user: {
        connect: {
          id: req.userId,
        },
      },
    });

    res.status(201).json({
      data: school,
    });
  })
);

router.get(
  "/:schoolId/users",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const schoolId = req.params.schoolId;
    await validateSchoolAdmin({
      userId: userId as string,
      schoolId,
    });
    const users = await getUsersForSchool({
      id: schoolId,
    });
    res.status(200).send({
      data: users,
    });
  })
);

router.get(
  "/:schoolId",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const schoolId = req.params.schoolId;
    await validateSchoolAdmin({
      userId: userId as string,
      schoolId,
    });
    const school = await getSchoolById({
      id: schoolId,
    });
    res.status(200).send({
      data: school,
    });
  })
);

router.get(
  "/:schoolId/invites",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const schoolId = req.params.schoolId;
    await validateSchoolAdmin({
      userId: userId as string,
      schoolId,
    });
    const users = await getInvitesForSchool({
      id: schoolId,
    });
    res.status(200).send({
      data: users,
    });
  })
);

router.delete(
  "/:schoolId",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const schoolId = req.params.schoolId;
    const school = await getSchoolById({
      id: schoolId,
    });
    if (school?.organizationId) {
      await validateOrganizationAdmin({
        userId: userId as string,
        organizationId: school.organizationId,
      });
    } else {
      throw new UnauthorizedError(
        "User is not authorized to delete this school"
      );
    }
    await deleteSchoolById({
      id: schoolId,
    });
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

router.put(
  "/:schoolId",
  [body("name").isString().exists()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = req.userId;

    await validateSchoolAdmin({
      userId: userId as string,
      schoolId: req.params.schoolId,
    });

    const school = await updateSchool(req.params.schoolId, {
      name,
    });

    res.status(201).json({
      data: school,
    });
  })
);

export default router;
