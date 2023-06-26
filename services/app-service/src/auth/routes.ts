import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import {
  signup,
  signin,
  addToWaitlist,
  forgotPassword,
  resetPassword,
} from "./service.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").exists().isEmail(),
    body("password").isString().exists(),
    body("firstName").isString().optional(),
    body("lastName").isString().optional(),
    body("receivePromotions").isBoolean().toBoolean().exists(),
    body("role").isString().optional(),
    body("districtOrSchool").isString().optional(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const {
      email,
      password,
      firstName,
      lastName,
      receivePromotions,
      role,
      districtOrSchool,
    } = req.body;
    // Create user
    const user = await signup({
      email,
      password,
      firstName,
      lastName,
      receivePromotions,
      role,
      districtOrSchool,
    });
    // Create session for user
    session.userId = user.id;
    res.status(201).send({ user });
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
    const user = await signin({ email, password });
    // Create session for user
    session.userId = user.id;
    res.status(200).send({ user });
  })
);

router.post(
  "/waitlist",
  [body("email").exists().isEmail()],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const { email } = req.body;
    await addToWaitlist({ email });
    res.status(200).send({ success: true });
  })
);

router.post(
  "/forgot-password",
  [body("email").exists().isEmail()],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const { email } = req.body;
    const origin = req.headers.origin;
    await forgotPassword({ email, origin: origin as string });
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

router.post(
  "/reset-password",
  [body("password").exists(), body("token").exists()],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const { password, token } = req.body;
    await resetPassword({ password, token });
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

export default router;
