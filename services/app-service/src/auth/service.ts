import bcrypt from "bcryptjs";
import {
  BadRequestError,
  UnauthorizedError,
} from "../utils/errors/index.js";
import dbClient from "../utils/prisma.js";
import isEmail from "validator/lib/isEmail.js";
import { User } from "@prisma/client";
import { createCustomer } from "../payments/service.js";
import analytics from "../utils/analytics.js";
import {cioClient} from "../utils/customerio.js";
import { IdentifierType } from 'customerio-node';
import { createForgotPasswordToken, getForgotPasswordToken } from "../utils/redis.js";
import { sendUserForgotPasswordEmail } from "../cio/service.js";

const transformUserForSegment = (user: User) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  questionsAsked: user.questionsAsked,
  receivePromotions: user.receivePromotions,
  stripeCustomerId: user.stripeCustomerId,
});

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  receivePromotions,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  receivePromotions: boolean;
}) => {
  email = email.trim().toLowerCase();

  // Verify email and password requirements
  if (!isEmail.default(email)) {
    throw new BadRequestError("Invalid email");
  }

  // Check if user exists
  const existingUser = await dbClient.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  // Hash password
  const _password = await bcrypt.hash(password, 10);

  const newUser = await dbClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: _password,
      receivePromotions,
    },
  });

  cioClient.identify(newUser.id, {
    email: newUser.email,
    created_at: newUser.createdAt,
    first_name: newUser.firstName,
    last_name: newUser.lastName,
    receive_promotions: newUser.receivePromotions,
    last_logged_in: new Date().toISOString(),
  });
  cioClient.mergeCustomers(IdentifierType.Id, newUser.id, IdentifierType.Id, newUser.email);

  // Create Stripe customer
  await createCustomer(newUser.id);
  // TODO: Create Customer.io Customer

  // Identify in Segment
  analytics.identify({
    userId: newUser.id,
    traits: {
      ...transformUserForSegment(newUser),
    },
  });

  return newUser.id;
};

export const signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  email = email.trim().toLowerCase();

  const user = await dbClient.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new UnauthorizedError("Invalid email or password");
  }

  analytics.identify({
    userId: user.id,
    traits: {
      ...transformUserForSegment(user),
    },
  });

  cioClient.identify(user.id, {
    email: user.email,
    last_logged_in: new Date().toISOString(),
  });

  return user.id;
};

export const addToWaitlist = async ({ email }: { email: string }) => {
  email = email.trim().toLowerCase();

  // Verify email is an email
  if (!isEmail.default(email)) {
    throw new BadRequestError("Invalid email");
  }
  try {
    await dbClient.waitlistEntry.create({
      data: {
        email,
      },
    });
    cioClient.identify(email, {
      email,
      waitlist: true
    });
  } catch (err) {
    console.error(err);
    // Swallow bc it's most likely a duplicate entry
  }
};

export const forgotPassword = async ({email, origin}: {email: string; origin: string}) => {
  const user = await dbClient.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new BadRequestError("Invalid email");
  }
  // Create token and store in Redis
  const token = await createForgotPasswordToken({ userId: user.id });
  const url = `${origin || "https://app.judie.io"}/reset-password?token=${token}`;
  // Send email with link to reset password
  console.log('resetpassurl', url)
  await sendUserForgotPasswordEmail({
    user,
    url,
  });
}