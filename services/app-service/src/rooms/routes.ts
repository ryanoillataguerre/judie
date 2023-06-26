import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors, requireJudieAuth } from "../utils/express.js";
import { createRoom } from "./service.js";
import {
  validateOrganizationAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("organizationId").isString().optional(),
    body("schoolId").isString().exists(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, schoolId, organizationId } = req.body;
    // Validate user has organization-level privileges
    if (schoolId) {
      await validateSchoolAdmin({
        userId: req.session.userId as string,
        schoolId,
      });
    }
    const organization = await createRoom({
      data: {
        name,
        ...(organizationId
          ? {
              organization: {
                connect: {
                  id: organizationId,
                },
              },
            }
          : {}),
        ...(schoolId
          ? {
              school: {
                connect: {
                  id: schoolId,
                },
              },
            }
          : {}),
      },
    });

    res.status(201).json({
      organization,
    });
  }
);

export default router;
