import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import {
  createFolder,
  getFolderById,
  getUserFoldersWithChatCounts,
  updateFolder,
} from "./service.js";

const router = Router();

router.get(
  "/:folderId",
  [param("folderId").exists()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const folder = await getFolderById(req.params.folderId as string);
    res.status(200).json({
      data: folder,
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
    const folders = await getUserFoldersWithChatCounts(session.userId);
    res.status(200).json({
      data: folders,
    });
  })
);

router.post(
  "/",
  [body("title").isString()],
  errorPassthrough(handleValidationErrors),
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    const folder = await createFolder({
      user: {
        connect: {
          id: session.userId,
        },
      },
      userTitle: req.body?.title || undefined,
    });

    res.status(200).json({
      data: folder,
    });
  })
);

router.put(
  "/:folderId",
  [
    body("title").isString(),
    param("folderId").exists(),
    body("newChats").optional().isArray(),
    body("removedChats").optional().isArray(),
  ],
  errorPassthrough(handleValidationErrors),
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    const folder = await updateFolder(req.params.folderId, {
      userTitle: req.body?.title || undefined,
      ...(req.body.newChats
        ? {
            chats: {
              connect: req.body.newChats.map((chatId: string) => ({
                id: chatId,
              })),
            },
          }
        : {}),
      ...(req.body.removedChats
        ? {
            chats: {
              disconnect: req.body.removedChats.map((chatId: string) => ({
                id: chatId,
              })),
            },
          }
        : {}),
    });

    res.status(200).json({
      data: folder,
    });
  })
);

router.delete(
  "/:folderId",
  [param("folderId").exists()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { userId } = req.session;
    const folderId = req.params.folderId;
    const folder = await getFolderById({
      id: folderId,
    });
    if (folder?.schoolId) {
      await validateSchoolAdmin({
        userId: userId as string,
        schoolId: folder.schoolId,
      });
    } else {
      throw new UnauthorizedError(
        "User is not authorized to delete this folder"
      );
    }
    await deleteFolderById({
      id: folderId,
    });
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

export default router;
