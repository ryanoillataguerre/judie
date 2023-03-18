import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse.js";
import bodyParser from "body-parser";
// import { createGPTRequestFromPrompt, getChatGPTCompletion } from "./service.js";

const router = Router();

// router.use(bodyParser.urlencoded({ extended: false }));
// router.post(
//   "/completion",
//   [body("From").exists(), body("Body").isString().exists()],
//   handleValidationErrors,
//   errorPassthrough(async (req: Request, res: Response) => {
//     const session = req.session;
//     // Generate the request to the ChatGPT model
//     const messages = await createGPTRequestFromPrompt(req.body.Body, session);
//     // Get response from ChatGPT
//     const completion = await getChatGPTCompletion(messages, session);
//     const twiml = new MessagingResponse();
//     if (completion?.content) {
//       twiml.message(completion?.content);
//     }
//     res.writeHead(200, { "Content-Type": "text/xml" });
//     res.end(twiml.toString());
//   })
// );

export default router;
