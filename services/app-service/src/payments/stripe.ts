import Stripe from "stripe";
import { User } from "@prisma/client";
import { handleSubscriptionCreated } from "./service.js";

const stripe = new Stripe(process.env.STRIPE_SK || "", {
  apiVersion: "2022-11-15",
});

export const createStripeCustomer = async (user: User) => {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  });
  return customer;
};

export const handleStripeWebhookEvents = async (
  body: any,
  stripeSignature: string,
  stripeWebhookSecret: string
) => {
  const relevantEvents = new Set([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "checkout.session.completed",
    "charge.refunded",
  ]);

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      stripeWebhookSecret
    );

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.created":
            console.log("customer.subscription.created");
            console.log(event.data);
            await handleSubscriptionCreated(
              event.data.object as Stripe.Subscription
            );
            break;
          case "customer.subscription.updated":
            console.log("customer.subscription.updated");
            console.log(event.data);
            break;
          case "customer.subscription.deleted":
            console.log("customer.subscription.deleted");
            console.log(event.data);
            break;
          case "checkout.session.completed":
            console.log("checkout.session.completed");
            console.log(event.data);
            break;
          case "charge.refunded":
            console.log("charge.refunded");
            console.log(event.data);
            break;
          default:
            break;
        }
      } catch (err) {
        throw err;
      }
    }
    return;
  } catch (error) {
    throw error;
  }
};
