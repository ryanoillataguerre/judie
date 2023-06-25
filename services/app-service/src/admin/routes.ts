import { Request, Response, Router } from "express";
import { body, param, query } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  messageRateLimit,
  requireAuth,
} from "../utils/express.js";
import {
  createChat,
  deleteChat,
  getChat,
  getCompletion,
  getUserChats,
  updateChat,
  deleteChatsForUser,
} from "./service.js";
import { Chat, Message } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import { incrementQuestionCountEntry } from "../utils/redis.js";

const router = Router();

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
      
    });
  })
);

export default router;
