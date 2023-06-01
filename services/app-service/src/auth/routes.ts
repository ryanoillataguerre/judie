import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import { signup, signin, addToWaitlist, forgotPassword } from "./service.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").exists().isEmail(),
    body("password").isString().exists(),
    body("firstName").isString().optional(),
    body("lastName").isString().optional(),
    body("receivePromotions").isBoolean().toBoolean().exists(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const { email, password, firstName, lastName, receivePromotions } =
      req.body;
    // Create user
    const userId = await signup({
      email,
      password,
      firstName,
      lastName,
      receivePromotions,
    });
    // Create session for user
    session.userId = userId;
    res.status(201).send({ success: true });
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
    res.status(200).send({ success: true });
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

router.post("/forgot-password", errorPassthrough(async (req: Request, res: Response) => {
  const { email } = req.body;
  await forgotPassword(email);
  res.status(200).send({
    data: {
      success: true,
    },
  });
}))

export default router;
