import Stripe from "stripe";
import { getUser, updateUser } from "../users/service.js";
import { createCheckoutSession, createStripeCustomer } from "./stripe.js";
import {
  Prisma,
  SubscriptionStatus,
  SubscriptionType,
  UserRole,
} from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createCustomer = async (userId: string): Promise<string> => {
  const user = await getUser({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }
  // Don't create a customer if they already have one
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await createStripeCustomer(user);

  // Save customer ID to user
  await updateUser(user.id, {
    stripeCustomerId: customer.id,
  });

  return customer.id;
};

export const checkout = async (
  userId: string,
  currentUrl: string,
  cancelUrl: string
) => {
  const user = await getUser({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }
  // If user doesn't have a customer ID, create one
  let newCustomerId;
  if (!user.stripeCustomerId) {
    newCustomerId = await createCustomer(userId);
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_MONTHLY_PRICE_ID,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: currentUrl,
    cancel_url: cancelUrl,
    customer: user.stripeCustomerId || newCustomerId || undefined,
    allow_promotion_codes: !(user.role === UserRole.JUDIE),
    discounts:
      user.role === UserRole.JUDIE
        ? [
            {
              coupon: process.env.STRIPE_EMPLOYEE_COUPON_ID,
            },
          ]
        : [],
  };
  return await createCheckoutSession(params);
};

export const createSubscription = async (
  params: Prisma.SubscriptionCreateInput
) => {
  return await dbClient.subscription.create({
    data: params,
  });
};

/**
 * 
 * @param event 
 * {
      "id": "sub_1N1MPUENY2x5x4GikQUf0Dxk",
      "object": "subscription",
      "application": null,
      "application_fee_percent": null,
      "automatic_tax": {
        "enabled": false
      },
      "billing_cycle_anchor": 1682569583,
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "cancellation_details": {
        "comment": null,
        "feedback": null,
        "reason": null
      },
      "collection_method": "charge_automatically",
      "created": 1682569583,
      "currency": "usd",
      "current_period_end": 1685161583,
      "current_period_start": 1682569583,
      "customer": "cus_NmwIKo7OByKxUk",
      "days_until_due": null,
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [
      ],
      "description": null,
      "discount": null,
      "ended_at": null,
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_NmwIPyKFOeRkXX",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1682569584,
            "metadata": {
            },
            "plan": {
              "id": "price_1N1LwCENY2x5x4Giui3urujY",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 5000,
              "amount_decimal": "5000",
              "billing_scheme": "per_unit",
              "created": 1682567768,
              "currency": "usd",
              "interval": "month",
              "interval_count": 1,
              "livemode": false,
              "metadata": {
              },
              "nickname": null,
              "product": "prod_Nl0xywQH0xoGVB",
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "price": {
              "id": "price_1N1LwCENY2x5x4Giui3urujY",
              "object": "price",
              "active": true,
              "billing_scheme": "per_unit",
              "created": 1682567768,
              "currency": "usd",
              "custom_unit_amount": null,
              "livemode": false,
              "lookup_key": null,
              "metadata": {
              },
              "nickname": null,
              "product": "prod_Nl0xywQH0xoGVB",
              "recurring": {
                "aggregate_usage": null,
                "interval": "month",
                "interval_count": 1,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "recurring",
              "unit_amount": 5000,
              "unit_amount_decimal": "5000"
            },
            "quantity": 1,
            "subscription": "sub_1N1MPUENY2x5x4GikQUf0Dxk",
            "tax_rates": [
            ]
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_1N1MPUENY2x5x4GikQUf0Dxk"
      },
      "latest_invoice": "in_1N1MPUENY2x5x4Gi9DdSdW7t",
      "livemode": false,
      "metadata": {
      },
      "next_pending_invoice_item_invoice": null,
      "on_behalf_of": null,
      "pause_collection": null,
      "payment_settings": {
        "payment_method_options": null,
        "payment_method_types": null,
        "save_default_payment_method": "off"
      },
      "pending_invoice_item_interval": null,
      "pending_setup_intent": null,
      "pending_update": null,
      "plan": {
        "id": "price_1N1LwCENY2x5x4Giui3urujY",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 5000,
        "amount_decimal": "5000",
        "billing_scheme": "per_unit",
        "created": 1682567768,
        "currency": "usd",
        "interval": "month",
        "interval_count": 1,
        "livemode": false,
        "metadata": {
        },
        "nickname": null,
        "product": "prod_Nl0xywQH0xoGVB",
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start_date": 1682569583,
      "status": "incomplete",
      "test_clock": null,
      "transfer_data": null,
      "trial_end": null,
      "trial_settings": {
        "end_behavior": {
          "missing_payment_method": "cancel"
        }
      },
      "trial_start": null
    }
 */
export const handleSubscriptionCreated = async (
  subscription: Stripe.Subscription
) => {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const priceId = subscription.items.data[0].price.id; // For when we have different plans
  const user = await getUser({ stripeCustomerId: customerId });
  if (!user) {
    throw new Error("User not found");
  }
  const subscriptionData: Prisma.SubscriptionCreateInput = {
    stripeId: subscriptionId,
    status: SubscriptionStatus.ACTIVE,
    type: SubscriptionType.MONTHLY,
    user: {
      connect: {
        id: user.id,
      },
    },
  };
  await createSubscription(subscriptionData);
};

export const handleSubscriptionCancelled = async (
  subscription: Stripe.Subscription
) => {
  if (subscription.cancel_at) {
    const subscriptionId = subscription.id;
    const subscriptionData: Prisma.SubscriptionUpdateInput = {
      canceledAt: new Date(subscription.cancel_at),
    };
    await dbClient.subscription.update({
      where: {
        stripeId: subscriptionId,
      },
      data: subscriptionData,
    });
  }
};
