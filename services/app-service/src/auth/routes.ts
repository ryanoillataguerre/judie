import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import { signup, signin } from "./service.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").exists().isEmail(),
    body("password").isString().exists(),
    body("name").isString().exists(),
    body("receivePromotions").isBoolean().toBoolean().exists(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const { email, password, name, receivePromotions } = req.body;
    // Create user
    const userId = await signup({ email, password, name, receivePromotions });
    // Create session for user
    session.userId = userId;
    res.sendStatus(201);
  })
);

router.post(
  "/signin",
  [body("email").exists().isEmail(), body("password").isString().exists()],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const { email, password } = req.body;
    // Create user
    const userId = await signin({ email, password });
    // Create session for user
    session.userId = userId;
    res.sendStatus(200);
  })
);

export default router;
