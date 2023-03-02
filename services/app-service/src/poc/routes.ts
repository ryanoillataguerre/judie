import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors } from "../utils/express.js";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse.js";
import bodyParser from "body-parser";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.post(
  "/completion",
  [body("From").exists(), body("Body").isString().exists()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const twiml = new MessagingResponse();

    console.log(req.body);
    const session = req.session;
    console.log(session);
    // const { email, password, name, receivePromotions } = req.body;
    // // Create user
    // console.log("signing up user");
    // const userId = await signup({ email, password, name, receivePromotions });
    // console.log("signed up");
    // // Create session for user
    // session.userId = userId;
    // res.sendStatus(201);
    // const completion = await getCompletion(req.body.Body);
    const completion = "Hello back!";
    twiml.message(completion);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
);

export default router;
