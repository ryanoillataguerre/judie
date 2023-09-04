import { Router, Request, Response } from "express";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  getUser,
  getUserPermissions,
  parentalConsentUser,
  updateUser,
  userAgeConsent,
  verifyUserEmail,
} from "./service.js";
import {
  Chat,
  Message,
  Subscription,
  SubscriptionStatus,
  User,
} from "@prisma/client";
import { body } from "express-validator";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import { createStripeBillingPortalSession } from "../payments/stripe.js";
import { sendFeedbackEmail } from "../cio/service.js";

const router = Router();

const transformUser = (
  user:
    | (User & {
        subscription: Subscription | null;
        chats: (Chat & {
          messages: Message[];
        })[];
      })
    | User
    | null
): Partial<
  User & {
    subscription: Subscription | null;
    chats: (Chat & {
      messages: Message[];
    })[];
  }
> | null => {
  if (!user) {
    return null;
  }
  const newUser: Partial<
    User & {
      subscription: Subscription | null;
      chats: (Chat & {
        messages: Message[];
      })[];
    }
  > = { ...user };
  delete newUser.password;
  delete newUser.stripeCustomerId;
  delete newUser.receivePromotions;
  return user;
};

router.put(
  "/me",
  [body("firstName").optional()],
  [body("lastName").optional()],
  [body("receivePromotions").isBoolean().optional()],
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const user = await updateUser(session.userId, {
      ...(req.body.firstName ? { firstName: req.body.firstName } : {}),
      ...(req.body.lastName ? { lastName: req.body.lastName } : {}),
      ...(req.body.receivePromotions !== undefined
        ? { receivePromotions: req.body.receivePromotions }
        : {}),
    });
    res.status(200).send({
      data: transformUser(user),
    });
  })
);

router.get(
  "/me",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const admin = req.query.admin;
    try {
      const user = await getUser(
        { id: session.userId },
        {
          permissions: admin
            ? {
                include: {
                  organization: true,
                  school: true,
                  room: true,
                },
              }
            : true,
          subscription: true,
        }
      );
      // TODO: Create a job to turn subs with a canceledAt in the past into canceled subs
      if (
        user?.subscription?.canceledAt &&
        new Date(user?.subscription?.canceledAt).getTime() <
          new Date().getTime() &&
        user?.subscription?.status !== SubscriptionStatus.CANCELED
      ) {
        const newUser = await updateUser(user.id, {
          subscription: {
            update: {
              status: SubscriptionStatus.CANCELED,
            },
          },
        });
        return res.status(200).send({
          data: transformUser(newUser),
        });
      }
      res.status(200).send({
        data: transformUser(user),
      });
    } catch (err) {
      throw new UnauthorizedError("No user id found in session");
    }
  })
);

router.post(
  "/dob-consent",
  [
    body("dateOfBirth").isString().exists(),
    body("parentEmail").isEmail().optional().withMessage("Invalid email"),
  ],
  handleValidationErrors,
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const user = await userAgeConsent({
      userId: session.userId,
      dateOfBirth: req.body.dateOfBirth,
      parentEmail: req.body.parentEmail,
    });
    res.status(200).send({
      data: transformUser(user),
    });
  })
);

router.get(
  "/billing-portal-link",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const link = await createStripeBillingPortalSession(
      session.userId,
      req.headers.origin as string
    );
    res.status(200).send({
      data: link,
    });
  })
);

router.get(
  "/permissions",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const user = await getUserPermissions({
      id: session.userId as string,
    });

    res.status(200).send({
      data: user,
    });
  })
);

router.post(
  "/:userId/verify",
  errorPassthrough(async (req: Request, res: Response) => {
    await verifyUserEmail(req.params.userId as string);
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

router.post(
  "/:userId/parental-consent",
  errorPassthrough(async (req: Request, res: Response) => {
    await parentalConsentUser(req.params.userId as string);
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

router.post(
  "/feedback",
  [
    body("feedback")
      .isString()
      .exists()
      .withMessage("Feedback must be a string"),
    body("email").isEmail().optional().withMessage("Invalid email"),
  ],
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    const feedback = req.body.feedback;
    const email = req.body.email;
    if (session.userId) {
      const user = await getUser({ id: session.userId });
      if (user) {
        await sendFeedbackEmail({
          email: user.email,
          feedback,
        });
      }
    } else {
      await sendFeedbackEmail({
        email,
        feedback,
      });
    }
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

export default router;
