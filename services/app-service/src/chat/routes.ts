import { Request, Response, Router } from "express";
import { body, query } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  createChat,
  getChat,
  getChatAndMessagesForUser,
  getCompletion,
  getUserChats,
} from "./service.js";
import { Chat, Message } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";

const router = Router();

const transformChat = (chat: Chat & { messages: Message[] }) => {
  // Remove system message from chat
  chat?.messages?.pop();
  return {
    id: chat.id,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    userId: chat.userId,
    messages: chat.messages?.length ? chat.messages.reverse() : [],
  } as Chat & { messages: Message[] };
};

router.post(
  "/completion",
  [body("query").exists()],
  [query("chatId").optional()],
  requireAuth,
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    // Get chat and messages
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const newChat = await getCompletion({
      chatId: req.query.chatId as string | undefined,
      query: req.body.query,
      userId: session.userId,
    });
    res.status(200).json({
      data: transformChat(newChat),
    });
  })
);

router.get(
  "/active",
  requireAuth,
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const chat = await getChatAndMessagesForUser(
      session.userId,
      req.body.newChat
    );

    res.status(200).json({
      data: transformChat(chat),
    });
  })
);

router.get(
  "/",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    // Typecasting to transform - need to better define transformChat type
    const chats = (await getUserChats(session.userId)) as (Chat & {
      messages: Message[];
    })[];

    res.status(200).json({
      data: chats?.map((chat) => transformChat(chat)) || [],
    });
  })
);

router.get(
  "/:chatId",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const chat = await getChat({
      id: req.params.chatId,
    });
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    res.status(200).json({
      data: transformChat(chat),
    });
  })
);

router.post(
  "/",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const newChat = await createChat({
      user: {
        connect: {
          id: session.userId,
        },
      },
    });

    res.status(200).json({
      data: transformChat(newChat),
    });
  })
);

export default router;
