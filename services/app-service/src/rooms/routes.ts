import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors, requireJudieAuth } from "../utils/express.js";
import { createRoom } from "./service.js";
import { validateOrganizationAdmin } from "../admin/service.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("address").isString().optional(),
    body("organizationId").isString().exists(),
    body("schoolId").isString().exists(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, organizationId } = req.body;
    // Validate user has organization-level privileges
    await validateOrganizationAdmin({
      userId: req.session.userId as string,
      organizationId,
    });
    const organization = await createRoom({
      data: {
        name,
        ...(req.body.organizationId
          ? {
              organization: {
                connect: {
                  id: organizationId,
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
      },
    });

    res.status(201).json({
      organization,
    });
  }
);

export default router;
