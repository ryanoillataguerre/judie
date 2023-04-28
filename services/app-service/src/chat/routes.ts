import { Request, Response, Router } from "express";
import { body, param, query } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  createChat,
  deleteChat,
  getChat,
  getCompletion,
  getUserChats,
  updateChat,
} from "./service.js";
import { Chat, Message } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import { incrementUserQuestionsAsked } from "../user/service.js";

const router = Router();

const transformChat = (chat: Chat & { messages: Message[] }) => {
  return {
    id: chat.id,
    subject: chat.subject,
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
    incrementUserQuestionsAsked(session.userId);
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

router.put(
  "/:chatId",
  requireAuth,
  [body("subject").optional()],
  [param("chatId").exists()],
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const { chatId } = req.params;
    const { subject } = req.body;
    const newChat = await updateChat(chatId, {
      subject,
    });

    res.status(200).json({
      data: transformChat(newChat),
    });
  })
);

router.delete(
  "/:chatId",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const { chatId } = req.params;
    await deleteChat(chatId);

    res.status(200).json({
      data: { success: true },
    });
  })
);

export default router;
