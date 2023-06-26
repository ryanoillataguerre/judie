import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  handleValidationErrors,
  requireAuth,
  requireJudieAuth,
} from "../utils/express.js";
import { createOrganization, getUsersForOrganization } from "./service.js";
import { validateOrganizationAdmin } from "../admin/service.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("primaryContactEmail").isEmail().exists(),
  ],
  // Only Judie employees can create organizations
  requireJudieAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, primaryContactEmail } = req.body;
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

    res.status(201).json({
      organization,
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
      users,
    });
  }
);

export default router;
