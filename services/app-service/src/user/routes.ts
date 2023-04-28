import { Router, Request, Response } from "express";
import { errorPassthrough, requireAuth } from "../utils/express.js";
import { getUser } from "./service.js";

const router = Router();

router.get(
  "/me",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const user = await getUser({ id: session.userId }!);
    res.status(200).send({
      data: user,
    });
  })
);

export default router;
