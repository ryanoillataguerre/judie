import { errorPassthrough } from "../utils/express.js";

import { Router, Request, Response, NextFunction } from "express";
import { handleStripeWebhookEvents } from "./stripe.js";

const router = Router();
router.post(
  "/stripe",
  errorPassthrough(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stripeSignature = req.headers["stripe-signature"];
      const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      if (stripeSignature && stripeWebhookSecret) {
        const { body } = req;
        await handleStripeWebhookEvents(
          body,
          String(stripeSignature),
          stripeWebhookSecret
        );
        res.status(200).send();
      } else {
        res.status(422).send("Invalid request");
      }
    } catch (error) {
      next(error);
    }
  })
);

export default router;
