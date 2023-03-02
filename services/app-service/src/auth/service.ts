import bcrypt from "bcryptjs";
import { BadRequestError } from "../utils/errors/index.js";
import dbClient from "../utils/prisma.js";
import isEmail from "validator/lib/isEmail.js";

// This is broken locally - Prisma requires attention
export const signup = async ({
  name,
  email,
  password,
  receivePromotions,
}: {
  name: string;
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
      name,
      email,
      password: _password,
      receivePromotions,
    },
  });

  // TODO: Identify user with analytics platform
  // TODO: Create Stripe customer

  return newUser.id;
};