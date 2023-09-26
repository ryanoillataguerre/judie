import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { errorPassthrough, handleValidationErrors } from "../utils/express.js";
import {
  signup,
  addToWaitlist,
  forgotPassword,
  resetPassword,
  changePassword,
} from "./service.js";

export const signupValidation = [
  body("email").exists().isEmail(),
  body("password").isString().exists(),
  body("firstName").isString().optional(),
  body("lastName").isString().optional(),
  body("receivePromotions").isBoolean().toBoolean().exists(),
  body("role").isString().optional(),
  body("districtOrSchool").isString().optional(),
];

const router = Router();

router.post(
  "/signup",
  signupValidation,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { uid, receivePromotions, role, districtOrSchool } = req.body;
    // Create user
    const user = await signup({
      uid,
      receivePromotions,
      role,
      districtOrSchool,
    });
    res.status(201).send({ data: user });
  })
);

router.put(
  "/change-password",
  [
    body("oldPassword").isString().exists(),
    body("newPassword").isString().exists(),
    body("passwordConfirm").isString().exists(),
  ],
  handleValidationErrors,
  errorPassthrough(async (req: Request, res: Response) => {
    const { newPassword, passwordConfirm, oldPassword } = req.body;
    // Change user password if they both match
    const user = await changePassword({
      userId: req.userId as string,
      oldPassword,
      newPassword,
      passwordConfirm,
    });
    res.status(200).send({ data: user });
  })
);

router.post(
  "/waitlist",
  [body("email").exists().isEmail()],
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { email } = req.body;
    await addToWaitlist({ email });
    res.status(200).send({ data: { success: true } });
  })
);

router.post(
  "/forgot-password",
  [body("email").exists().isEmail()],
  errorPassthrough(handleValidationErrors),
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
  errorPassthrough(handleValidationErrors),
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
