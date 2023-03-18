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
    console.time("gettingChatAndMessages");
    // Get chat and messages
    const chat = await getChatAndMessagesForUser(
      session.userId,
      req.body.newChat
    );
    console.timeEnd("gettingChatAndMessages");
    // Create GPT request from prompt
    console.time("createGPTRequestFromPrompt");
    const chatWithUserPrompt = await createGPTRequestFromPrompt({
      userId: session.userId,
      prompt: req.body.query,
      chat,
    });
    console.timeEnd("createGPTRequestFromPrompt");
    // Get response from ChatGPT
    console.time("getChatGPTCompletion");
    const messages = await getChatGPTCompletion(chatWithUserPrompt);
    console.timeEnd("getChatGPTCompletion");
    res.status(200).json({
      data: messages,
    });
  })
);

export default router;
