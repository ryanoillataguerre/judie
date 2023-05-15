import { Router, Request, Response } from "express";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import { getUser, updateUser } from "./service.js";
import { Chat, Message, Subscription, User } from "@prisma/client";
import { body } from "express-validator";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

const router = Router();

const transformUser = (
  user:
    | (User & {
        subscription: Subscription | null;
        chats: (Chat & {
          messages: Message[];
        })[];
      })
    | User
    | null
): Partial<
  User & {
    subscription: Subscription | null;
    chats: (Chat & {
      messages: Message[];
    })[];
  }
> | null => {
  if (!user) {
    return null;
  }
  const newUser: Partial<
    User & {
      subscription: Subscription | null;
      chats: (Chat & {
        messages: Message[];
      })[];
    }
  > = { ...user };
  delete newUser.password;
  delete newUser.stripeCustomerId;
  delete newUser.receivePromotions;
  return user;
};

router.get(
  "/me",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const user = await getUser({ id: session.userId });
    res.status(200).send({
      data: transformUser(user),
    });
  })
);

router.put(
  "/",
  [body("firstName").optional()],
  [body("lastName").optional()],
  [body("receivePromotions").isBoolean().optional()],
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const user = await updateUser(session.userId, {
      firstName: req.body.firstName ?? undefined,
      lastName: req.body.lastName ?? undefined,
      receivePromotions: req.body.receivePromotions ?? undefined,
    });
    res.status(200).send({
      data: transformUser(user),
    });
  })
);

export default router;
