import { Request, Response, Router } from "express";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import { createCheckoutSession, createCustomer } from "./service.js";
import { body } from "express-validator";

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

router.post(
  "/checkout-session",
  [body("currentUrl").exists().isURL()],
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    // Create Stripe customer for user
    const checkoutSession = await createCheckoutSession(
      session.userId,
      req.body.currentUrl
        ? `${req.body.currentUrl}?paid=true`
        : `${req.headers.origin}/chats?paid=true`,
      req.body.currentUrl || `${req.headers.origin}/chats?paid=true`
    );

    res.status(200).json({
      data: checkoutSession,
    });
  })
);

export default router;
