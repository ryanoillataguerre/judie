import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import { createFolder, updateFolder } from "./service.js";

const router = Router();

router.post(
  "/",
  [body("title").isString()],
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
  [body("title").isString(), param("folderId").exists()],
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    const folder = await updateFolder(req.params.folderId, {
      userTitle: req.body?.title || undefined,
    });

    res.status(200).json({
      data: folder,
    });
  })
);

export default router;
