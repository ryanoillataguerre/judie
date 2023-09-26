import Stripe from "stripe";
import { User } from "@prisma/client";
import {
  createCustomer,
  handleSubscriptionCreated,
  handleSubscriptionCancelled,
} from "./service.js";
import { getUser } from "../users/service.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

const stripe = new Stripe(process.env.STRIPE_SK || "", {
  apiVersion: "2022-11-15",
});

export const createStripeCustomer = async (user: User) => {
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName || ""} ${user.lastName || ""}`,
    metadata: {
      userId: user.id,
    },
  });
  return customer;
};

export const getStripeCustomer = async (customerId: string) => {
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
};

export const getStripeCustomerSubscriptions = async (customerId: string) => {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });
  return subscriptions;
};

export const createCheckoutSession = async (
  params: Stripe.Checkout.SessionCreateParams
) => {
  const session = await stripe.checkout.sessions.create(params);
  return session;
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
            console.info("customer.subscription.created");
            await handleSubscriptionCreated(
              event.data.object as Stripe.Subscription
            );
            break;
          case "customer.subscription.updated":
            console.info("customer.subscription.updated");
            const canceledOrTrialEnded =
              !!(event.data.object as Stripe.Subscription)?.canceled_at ||
              new Date(
                (event.data.object as Stripe.Subscription)?.trial_end || ""
              ) < new Date();
            if (canceledOrTrialEnded) {
              await handleSubscriptionCancelled(
                event.data.object as Stripe.Subscription
              );
            }
            break;
          case "customer.subscription.deleted":
            console.info("customer.subscription.deleted");
            console.info(event.data);
            await handleSubscriptionCancelled(
              event.data.object as Stripe.Subscription
            );
            break;
          case "checkout.session.completed":
            console.info("checkout.session.completed");
            console.info(event.data);
            break;
          case "charge.refunded":
            console.info("charge.refunded");
            console.info(event.data);
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

export const createStripeBillingPortalSession = async (
  userId: string,
  reqHeadersOrigin: string
) => {
  try {
    const returnUrl = `${reqHeadersOrigin}/settings`;
    const user = await getUser({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    const customerId = String(user?.stripeCustomerId);
    if (!customerId) {
      await createCustomer(user.id);
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  } catch (err) {
    throw err;
  }
};
