import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors } from "../utils/express";
import { signup } from "./service";

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
  async (req: Request, res: Response) => {
    const session = req.session;
    const { email, password, name, receivePromotions } = req.body;
    // Create user
    console.log("signing up user");
    const userId = await signup({ email, password, name, receivePromotions });
    console.log("signed up");
    // Create session for user
    session.userId = userId;
    res.sendStatus(201);
  }
);

export default router;
