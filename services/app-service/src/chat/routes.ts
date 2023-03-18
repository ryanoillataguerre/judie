import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import { createGPTRequestFromPrompt, getChatGPTCompletion } from "./service.js";

const router = Router();

router.post(
  "/completion",
  [body("query").exists()],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    // Generate the request to the ChatGPT model
    const messages = await createGPTRequestFromPrompt(
      session.userId,
      req.body.Body
    );
    // Get response from ChatGPT
    const completion = await getChatGPTCompletion(messages);
    res.status(200).json({
      completion: completion,
    });
  })
);

export default router;
