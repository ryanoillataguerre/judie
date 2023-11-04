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
  getPDFTextPrompt,
  validateMaxAssignmentLength,
  updateChatSubject,
} from "./service.js";
import { Chat, ChatFolder, Message } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import { incrementQuestionCountEntry } from "../utils/redis.js";
import dbClient from "../utils/prisma.js";
import multer from "multer";
import { transcribeAudio } from "../openai/service.js";
import { Readable } from "stream";
import { temporaryDirectory } from "tempy";
import { extractTextFromPdf } from "../pdf/service.js";
import BadRequestError from "../utils/errors/BadRequestError.js";
import { createChatAssignment } from "../assignments/service.js";

const router = Router();

const transformChat = (
  chat: Chat & { messages: Message[]; folder?: ChatFolder }
) => {
  return {
    id: chat.id,
    userTitle: chat.userTitle,
    subject: chat.subject,
    mode: chat.mode,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    userId: chat.userId,
    messages: chat.messages?.length ? chat.messages.reverse() : [],
    folder: chat.folder,
  } as Chat & { messages: Message[]; folder?: ChatFolder };
};

router.post(
  "/completion",
  [body("query").exists()],
  [query("chatId").optional()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(messageRateLimit),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    // Get chat and messages
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    await getCompletion({
      chatId: req.query.chatId as string | undefined,
      query: req.body.query,
      userId: session.userId,
      response: res,
    });
    res.status(200).end();
    await incrementQuestionCountEntry({ userId: session.userId });
    await dbClient.user.update({
      where: {
        id: session.userId,
      },
      data: {
        lastMessageAt: new Date(),
      },
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
      folder?: ChatFolder;
    })[];

    res.status(200).json({
      data: chats?.map((chat) => transformChat(chat)) || [],
    });
  })
);

router.get(
  "/:chatId",
  requireAuth,
  errorPassthrough(handleValidationErrors),
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
  [
    body("subject").optional(),
    body("folderId").optional(),
    body("userTitle").optional(),
  ],
  requireAuth,
  errorPassthrough(handleValidationErrors),
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
      ...(req.body?.folderId
        ? {
            folder: {
              connect: {
                id: req.body.folderId,
              },
            },
          }
        : {}),
      subject: req.body?.subject || undefined,
      userTitle: req.body?.userTitle || undefined,
    });

    if (req.body.subject) {
      await updateChatSubject({
        userId: session.userId,
        subject: req.body.subject,
        userTitle: req.body.userTitle,
        folderId: req.body.folderId,
        chatId: newChat.id,
      });
    }

    res.status(200).json({
      data: transformChat(newChat),
    });
  })
);

router.put(
  "/:chatId",
  requireAuth,
  [
    body("subject").optional(),
    param("chatId").exists(),
    body("userTitle").optional(),
    body("folderId").optional(),
    body("mode").optional(),
  ],
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const { chatId } = req.params;
    const { subject, userTitle, folderId, mode } = req.body;
    const existingChat = await getChat({ id: chatId });
    if (!existingChat) {
      throw new NotFoundError("Chat not found");
    }

    // If subject is being set for the first time
    if (subject) {
      await updateChatSubject({
        userId: session.userId,
        subject,
        userTitle,
        folderId,
        mode,
        chatId,
      });
    }

    // If subject is already set, or if update is something else
    const newChat = await updateChat(chatId, {
      subject,
      userTitle,
      mode,
      ...(folderId
        ? {
            folder: {
              connect: {
                id: folderId,
              },
            },
          }
        : {}),
    });

    res.status(200).json({
      data: transformChat(newChat),
    });
  })
);

router.delete(
  "/clear",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    await deleteChatsForUser(session.userId);

    res.status(200).json({
      data: { success: true },
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

// Can factor this out into its own module if whisper usage expands
const storage = multer.memoryStorage();
let upload = multer({ dest: "tmp/", storage });
// Whisper transcription
router.post(
  "/whisper/transcribe",
  requireAuth,
  upload.single("audio"),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    // How to get formData?
    const audioFile = req.file;

    if (audioFile) {
      const readableStream = Readable.from(audioFile.buffer);

      const tempDir = temporaryDirectory();
      (readableStream as any).path = `${tempDir}/audio.wav`;
      const transcript = await transcribeAudio(readableStream);
      res.status(200).json({
        data: { transcript },
      });
    }
  })
);

router.post(
  "/:chatId/context/pdf",
  requireAuth,
  upload.single("file"),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const file = req.file;
    if (file) {
      // Get transcript of file
      const text = await extractTextFromPdf(file);
      if (text) {
        // Ensure length of message isn't going to bankrupt us in tokens
        validateMaxAssignmentLength(text);
        const { readableContent, query } = getPDFTextPrompt({ text });
        // Save to DB as Assignment
        await createChatAssignment({
          chatId: req.params.chatId,
          text,
        });

        // Get completion from inference service
        await getCompletion({
          chatId: req.params.chatId,
          userId: session.userId,
          response: res,
          query,
          readableContent,
        });
        res.status(200).end();
      } else {
        throw new BadRequestError("Could not read PDF");
      }
    } else {
      throw new BadRequestError("No file provided");
    }
  })
);

export default router;
