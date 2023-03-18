import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import {
  createGPTRequestFromPrompt,
  getChatAndMessagesForUser,
  getChatGPTCompletion,
} from "./service.js";

const router = Router();

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
    const messages = await getChatGPTCompletion(chatWithUserPrompt);
    res.status(200).json({
      data: messages,
    });
  })
);

export default router;
