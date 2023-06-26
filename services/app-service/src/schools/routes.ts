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
    const organization = await createSchool({
      name,
      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

    res.status(201).json({
      organization,
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
