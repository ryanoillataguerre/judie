import { Request, Response, Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
  "/signup",
  [
    body("email").exists().isEmail(),
    body("password").isString().exists(),
    body("firstName").isString().optional(),
    body("lastName").isString().optional(),
    body("receivePromotions").isBoolean().toBoolean().optional(),
  ],
  (req: Request, res: Response) => {
    console.log(req);
    res.status(200).send();
  }
);
