import { Request, Response, Router } from "express";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import { createCustomer } from "./stripe.js";

const router = Router();

router.post(
  "/customer",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    // Create Stripe customer for user
    const customerId = await createCustomer(session.userId);

    res.status(200).json({
      data: {
        customerId,
      },
    });
  })
);

export default router;
