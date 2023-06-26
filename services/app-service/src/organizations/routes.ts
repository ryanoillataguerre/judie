import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors, requireJudieAuth } from "../utils/express.js";
import { createOrganization } from "./service.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().isLength({ min: 1 }),
    body("primaryContactEmail").isEmail(),
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

export default router;
