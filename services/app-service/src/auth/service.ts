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
import firebaseApp from "../utils/firebase.js";
import { getUser } from "../users/service.js";

const transformUserForSegment = (user: User, districtOrSchool?: string) => ({
  firebaseUid: user.firebaseUid,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  receivePromotions: user.receivePromotions,
  stripeCustomerId: user.stripeCustomerId,
  districtOrSchool,
});

export const signup = async ({
  uid,
  receivePromotions,
  role,
  districtOrSchool,
  isB2B,
}: {
  uid: string;
  receivePromotions: boolean;
  role?: UserRole;
  districtOrSchool?: string;
  isB2B?: boolean;
}) => {
  const newUser = await dbClient.user.create({
    data: {
      firebaseUid: uid,
      receivePromotions,
      role: role || UserRole.STUDENT,
      ...(isB2B
        ? {
            parentalConsent: true,
          }
        : {}),
    },
    include: {
      subscription: true,
    },
  });

  const fbUser = await firebaseApp.auth().getUser(uid);
  const { email } = fbUser;
  await cioClient.identify(newUser.id, {
    email,
    created_at: newUser.createdAt,
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
  // TODO: Fire forgot password email in firebase
  const user = await getUser({ email });
  if (!user) {
    throw new BadRequestError("User not found");
  }
  const link = await firebaseApp.auth().generatePasswordResetLink(email, {
    url: `${origin}/reset-password`,
    handleCodeInApp: true,
  });

  return await sendUserForgotPasswordEmail({ user, url: link });
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  // TODO: Fire reset password email in firebase
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
  // TODO: Change password in firebase
};
