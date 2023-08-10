import { Request, Response, Router } from "express";
import { Storage, StorageOptions } from "@google-cloud/storage";
import { param } from "express-validator";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import { getMessageById, updateMessage } from "./service.js";
import { createAudioFile } from "../elevenlabs/service.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import { Environment, getEnv } from "../utils/env.js";
import InternalError from "../utils/errors/InternalError.js";
import { temporaryFile } from "tempy";

const getStorageOptions = (): StorageOptions => {
  const environment = getEnv();
  if (environment === Environment.Local) {
    return {
      projectId: process.env.GCLOUD_PROJECT,
      credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY,
      },
    };
  }
  // Rely on default GCP internal credentials when in Cloud Run
  // Hopefully this works? TODO Ryan - verify once deployed
  return {};
};
const storage = new Storage(getStorageOptions());
const gcsBucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME || "");

const router = Router();

router.post(
  "/:messageId/narrate",
  requireAuth,
  [param("messageId").exists().withMessage("Message id is required")],
  errorPassthrough(async (req: Request, res: Response) => {
    // Get message
    const message = await getMessageById(req.params.messageId);
    if (!message) {
      throw new NotFoundError("Message not found");
    }
    if (message.audioFileUrl) {
      throw new InternalError("Message already has audio file");
    }
    // Create temp audio file of elevenlabs audio
    const filePath = temporaryFile({ extension: "mp3" });
    try {
      await createAudioFile(message.readableContent, filePath);
    } catch (err) {
      throw new InternalError("Error creating audio file");
    }
    const bucketFilePath = `messages/${message.id}.mp3`;
    const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET_NAME}/${bucketFilePath}`;
    if (filePath) {
      // Upload file to GCS
      try {
        const result = await gcsBucket.upload(filePath, {
          destination: bucketFilePath,
        });
        await result[0]?.makePublic();
      } catch (err) {
        throw new InternalError("Error uploading audio file to cloud storage");
      }
    }
    // Update message with audio file url
    const updatedMessage = await updateMessage(message.id, {
      audioFileUrl: publicUrl,
    });
    res.status(201).send({
      data: updatedMessage,
    });
  })
);

export default router;
