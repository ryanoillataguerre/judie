import { Router, Request, Response } from "express";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import { getUser } from "./service.js";
import { Chat, Message, Subscription, User } from "@prisma/client";

const router = Router();

const transformUser = (
  user:
    | (User & {
        subscription: Subscription | null;
        chats: (Chat & {
          messages: Message[];
        })[];
      })
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
    const user = await getUser({ id: session.userId }!);
    res.status(200).send({
      data: transformUser(user),
    });
  })
);

export default router;
