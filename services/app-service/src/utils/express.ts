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
import { ChatCompletionRequestMessage } from "openai";

// Base server headers
export const headers = (req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Credentials, Set-Cookie, Cookie, Cookies, Cross-Origin, Access-Control-Allow-Credentials, Authorization, Access-Control-Allow-Origin"
  );
  // TODO: When switching this to web, change this to actually only allow origins
  // const allowedOrigins = ["http://localhost:3000", "http://web:3000"];
  // const origin = String(req.headers.origin);
  // if (allowedOrigins.includes(origin)) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }
  res.header("Access-Control-Allow-Origin", "*");
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
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});
export const sessionLayer = () =>
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24 * 30, // session max age in miliseconds - 30d - expire after 30d inactivity
    },
  });

// Extend express session type
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Morgan logger
export const morganLogger = () =>
  morgan(":method :url :status - :response-time ms", {
    immediate: false,
  });

export type JudieSession = Session & Partial<SessionData>;
