import bcrypt from "bcryptjs";
import { BadRequestError, UnauthorizedError } from "../utils/errors/index.js";
import dbClient from "../utils/prisma.js";
import isEmail from "validator/lib/isEmail.js";
import { GradeYear, User, UserRole } from "@prisma/client";
import { createCustomer } from "../payments/service.js";
import analytics from "../utils/analytics.js";
import { cioClient } from "../utils/customerio.js";
import {
  createForgotPasswordToken,
  getForgotPasswordToken,
  deleteForgotPasswordToken,
} from "../utils/redis.js";
import {
  sendUserForgotPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../cio/service.js";
import { sessionStore } from "../utils/express.js";
import { Environment, getEnv } from "../utils/env.js";

const transformUserForSegment = (user: User, districtOrSchool?: string) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  receivePromotions: user.receivePromotions,
  stripeCustomerId: user.stripeCustomerId,
  districtOrSchool,
});

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  receivePromotions,
  role,
  districtOrSchool,
  isB2B,
  gradeYear,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  receivePromotions: boolean;
  role?: UserRole;
  districtOrSchool?: string;
  gradeYear?: GradeYear;
  isB2B?: boolean;
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
      role: role || UserRole.STUDENT,
      ...(isB2B
        ? {
            parentalConsent: true,
          }
        : {}),
      profile: {
        create: {
          gradeYear,
        },
      },
    },
    include: {
      subscription: true,
    },
  });

  await cioClient.identify(newUser.id, {
    email: newUser.email,
    created_at: newUser.createdAt,
    first_name: newUser.firstName,
    last_name: newUser.lastName,
    receive_promotions: newUser.receivePromotions,
    role: newUser.role,
    district_or_school: districtOrSchool,
    last_logged_in: new Date().toISOString(),
  });
  // TODO Ryan - this is failing - necessary?
  // cioClient.mergeCustomers(IdentifierType.Id, newUser.id, IdentifierType.Id, newUser.email);

  // Create Stripe customer
  await createCustomer(newUser.id);

  // Identify in Segment
  analytics.identify({
    userId: newUser.id,
    traits: transformUserForSegment(newUser, districtOrSchool),
  });

  await sendWelcomeEmail({ user: newUser });
  await sendVerificationEmail({ user: newUser });

  return newUser;
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
    include: {
      subscription: true,
    },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const match = await bcrypt.compare(password, user.password || "");
  if (!match) {
    throw new UnauthorizedError("Invalid email or password");
  }

  analytics.identify({
    userId: user.id,
    traits: transformUserForSegment(user),
  });

  await cioClient.identify(user.id, {
    email: user.email,
    last_logged_in: new Date().toISOString(),
  });

  return user;
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
      waitlist: true,
    });
  } catch (err) {
    console.error(err);
    // Swallow bc it's most likely a duplicate entry
  }
};

export const forgotPassword = async ({
  email,
  origin,
}: {
  email: string;
  origin: string;
}) => {
  const user = await dbClient.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new BadRequestError("Invalid email");
  }
  const env: Environment = getEnv();
  // Create token and store in Redis
  const token = await createForgotPasswordToken({ userId: user.id });
  const url = `${
    `${
      env === Environment.Local ? origin.slice(0, 7) : origin.slice(0, 8)
    }app.${origin.slice(8, origin.length)}` || "https://app.judie.io"
  }/reset-password?token=${token}`;
  // Send email with link to reset password
  return await sendUserForgotPasswordEmail({
    user,
    url,
  });
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  // Check Redis for token
  const userId = await getForgotPasswordToken({ token });
  if (!userId) {
    throw new BadRequestError("Invalid token, try requesting another email.");
  }
  // Update user password
  const _password = await bcrypt.hash(password, 10);
  await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      password: _password,
    },
  });
  // Delete token from Redis
  await deleteForgotPasswordToken({ token });
};

export const setUserSessionId = async ({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) => {
  await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      lastSessionId: sessionId,
    },
  });
};

export const destroyUserSession = async ({ userId }: { userId: string }) => {
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  const userSid = user?.lastSessionId;
  if (!userSid) {
    console.info(
      `Attempted to destroy session for user ${userId} but no session found`
    );
    return;
  }
  sessionStore.destroy(userSid, (err) => {
    if (err) {
      console.error("Error destroying session", err);
    }
  });
};

export const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
  passwordConfirm,
}: {
  userId: string;
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}) => {
  if (newPassword !== passwordConfirm) {
    throw new BadRequestError("Passwords do not match");
  }
  // Test old password is accurate
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new UnauthorizedError("No user id found in session");
  }
  const match = await bcrypt.compare(oldPassword, user.password || "");
  if (!match) {
    throw new BadRequestError("Old password is incorrect");
  }
  // Update password
  const _password = await bcrypt.hash(newPassword, 10);
  const newUser = await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      password: _password,
    },
  });
  return newUser;
};
