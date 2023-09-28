import { Request, Response, Router } from "express";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import { checkout, createCustomer } from "./service.js";
import { body } from "express-validator";

const router = Router();

router.post(
  "/customer",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!req.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    // Create Stripe customer for user
    const customerId = await createCustomer(req.userId);

    res.status(200).json({
      data: {
        customerId,
      },
    });
  })
);

router.post(
  "/checkout-session",
  [body("currentUrl").exists().isString()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!req.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    // Create Stripe Checkout Session for user
    const checkoutSession = await checkout(
      req.userId,
      req.body.currentUrl
        ? `${req.body.currentUrl}${
            req.body.currentUrl.includes("?id=") ? "&paid=true" : "?paid=true"
          }`
        : `${req.headers.origin}/chat?paid=true`,
      req.body.currentUrl || `${req.headers.origin}/chat`
    );

    res.status(200).json({
      data: checkoutSession.url,
    });
  })
);

export default router;
