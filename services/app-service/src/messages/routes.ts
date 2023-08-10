import { Request, Response, Router } from "express";
import { errorPassthrough } from "../utils/express.js";
import { param } from "express-validator";
import { getMessageById } from "./service.js";
import NotFoundError from "../utils/errors/NotFoundError.js";

const router = Router();

router.post(
  "/:messageId/narrate",
  [param("messageId").exists().withMessage("Message id is required")],
  errorPassthrough(async (req: Request, res: Response) => {
    // Get message
    const message = getMessageById(req.params.messageId);
    if (!message) {
      throw new NotFoundError("Message not found");
    }
    // Send message to elevenlabs stream

    // Save response to temp file

    // Upload file to GCS
  })
);

export default router;
