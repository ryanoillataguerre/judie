import Stripe from "stripe";
import { getUser, updateUser } from "../user/service.js";

const stripe = new Stripe(process.env.STRIPE_SK || "", {
  apiVersion: "2022-11-15",
});

export const createCustomer = async (userId: string): Promise<string> => {
  const user = await getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  // Don't create a customer if they already have one
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  });
  // Save customer ID to user
  await updateUser(user.id, {
    stripeCustomerId: customer.id,
  });

  return customer.id;
};
