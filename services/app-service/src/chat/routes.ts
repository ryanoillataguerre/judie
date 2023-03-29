import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import {
  createGPTRequestFromPrompt,
  getChatAndMessagesForUser,
  getChatGPTCompletion,
} from "./service.js";
import { Chat, Message } from "@prisma/client";
import InternalError from "../utils/errors/InternalError.js";

const router = Router();

const transformChat = (chat: Chat & { messages: Message[] }) => {
  // Remove system message from chat
  chat?.messages?.pop();
  return {
    id: chat.id,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    userId: chat.userId,
    messages: chat.messages ? chat.messages.reverse() : [],
  } as Chat & { messages: Message[] };
};

router.post(
  "/completion",
  [body("query").exists()],
  [body("newChat").exists().isBoolean().default(false)],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    // Get chat and messages
    const chat = await getChatAndMessagesForUser(
      session.userId,
      req.body.newChat
    );
    // Create GPT request from prompt
    const chatWithUserPrompt = await createGPTRequestFromPrompt({
      userId: session.userId,
      prompt: req.body.query,
      chat,
    });
    // Get response from ChatGPT
    console.log("chat", chatWithUserPrompt);
    const latestChat = await getChatGPTCompletion(chatWithUserPrompt);
    if (!latestChat) {
      throw new InternalError("Could not get response from ChatGPT");
    }
    res.status(200).json({
      data: transformChat(latestChat),
    });
  })
);

router.get(
  "/active",
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

export default router;
