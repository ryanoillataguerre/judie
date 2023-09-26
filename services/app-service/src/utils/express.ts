import { Request, Response, NextFunction, RequestHandler } from "express";
import session, { Session, SessionData } from "express-session";
import connectRedis from "connect-redis";
import { Result, ValidationError, validationResult } from "express-validator";
import {
  BadRequestError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "./errors/index.js";
import { Redis } from "ioredis";
import morgan from "morgan";
import { isProduction, isSandbox } from "./env.js";
import { getUser, updateUser } from "../users/service.js";
import { createQuestionCountEntry, getQuestionCountEntry } from "./redis.js";
import { SubscriptionStatus, UserRole } from "@prisma/client";
import firebaseApp from "./firebase.js";

// Base server headers
export const headers = (req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Credentials, Set-Cookie, Cookie, Cookies, Cross-Origin, Access-Control-Allow-Credentials, Authorization, Access-Control-Allow-Origin"
  );
  const allowedOrigins = isProduction()
    ? ["https://app.judie.io"]
    : isSandbox()
    ? ["https://app.sandbox.judie.io"]
    : ["http://localhost:3000", "http://web:3000"];

  const origin = String(req.headers.origin);
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
};

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const validationErrors: Result<ValidationError> = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new UnprocessableEntityError("Validation failed", 422, {
      validationErrors: validationErrors.array(),
    });
  }
  next();
};

export const messageRateLimit = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError("No user id found in session");
  }
  const user = await getUser({ id: userId });
  if (user?.subscription?.status === SubscriptionStatus.ACTIVE) {
    return next();
  }

  const existingQuestionCountEntry = await getQuestionCountEntry({ userId });
  if (existingQuestionCountEntry >= 7) {
    throw new BadRequestError("Rate limit exceeded", 429);
  }
  if (!existingQuestionCountEntry) {
    await createQuestionCountEntry({
      userId,
    });
  }
  await updateUser(userId, {
    questionsAsked: {
      increment: 1,
    },
  });
  next();
};

export const requireAuth = (req: Request, _: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new UnauthorizedError("Not authorized");
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const requireJudieAuth = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new UnauthorizedError("Not authorized");
    }
    const user = await getUser({ id: req.userId });
    if (!(user?.role === UserRole.JUDIE)) {
      throw new UnauthorizedError("Not authorized");
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Error wrapping Higher order function
// This is used to pass our custom errors into the error handler middleware below
export const errorPassthrough =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // No idea why eslint is warning here
      // Awaiting definitely does have an affect, since
      // RequestHandler can be (and always is in our case) async
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

// Error handler
export const errorHandler = (
  error:
    | InternalError
    | BadRequestError
    | NotFoundError
    | UnauthorizedError
    | UnprocessableEntityError,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  console.error(`Error: ${req.method} - ${req.path}`);
  console.error(error);

  const { name, message, details } = error;
  const response = {
    error: {
      name,
      message,
      details,
    },
  };
  return res.status(error.code || 404).send(response);
};

// Session Layer
const RedisStore = connectRedis(session);
const redisClient = new Redis({
  port: parseInt(process.env.REDIS_PORT || "6379"),
  host: process.env.REDIS_HOST || "localhost",
});
export const sessionStore = new RedisStore({ client: redisClient });
export const authMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      next();
      return;
    }

    const token = headerToken.split(" ")[1];
    const { uid } = await firebaseApp.auth().verifyIdToken(token);
    const user = await getUser({ firebaseUid: uid });
    if (!user) {
      next();
      return;
    }
    req.userId = user.id;
  };

// Morgan logger
export const morganLogger = () =>
  morgan(":method :url :status - :response-time ms", {
    immediate: false,
  });

export type JudieSession = Session & Partial<SessionData>;
