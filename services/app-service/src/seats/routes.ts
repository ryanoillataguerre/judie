import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireJudieAuth,
} from "../utils/express.js";
import {
  validateOrganizationAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";
import { setSeatCount } from "./service.js";

const router = Router();

router.put(
  "/seats",
  [
    body("count").isInt().exists(),
    body("organizationId").isString().optional(),
    body("schoolId").isString().optional(),
  ],
  // Only Judie employees can edit seats
  requireJudieAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { count } = req.body;
    const userId = req.userId;

    // The ordering of these does matter
    if (req.body.schoolId) {
      await validateSchoolAdmin({
        userId: userId as string,
        schoolId: req.body.schoolId,
      });
    } else if (!req.body.schoolId && req.body.organizationId) {
      await validateOrganizationAdmin({
        userId: userId as string,
        organizationId: req.body.organizationId,
      });
    }

    const schoolOrOrganization = await setSeatCount({
      count,
      organizationId: req.body.organizationId,
      schoolId: req.body.schoolId,
    });

    res.status(200).json({ data: schoolOrOrganization });
  })
);

export default router;
