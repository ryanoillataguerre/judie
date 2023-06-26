import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  handleValidationErrors,
  requireAuth,
  requireJudieAuth,
} from "../utils/express.js";
import { createRoom, getUsersForRoom } from "./service.js";
import {
  validateOrganizationAdmin,
  validateRoomAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("organizationId").isString().optional(),
    body("schoolId").isString().exists(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, schoolId, organizationId } = req.body;
    // Validate user has organization-level privileges
    if (schoolId) {
      await validateSchoolAdmin({
        userId: req.session.userId as string,
        schoolId,
      });
    }
    const organization = await createRoom({
      data: {
        name,
        ...(organizationId
          ? {
              organization: {
                connect: {
                  id: organizationId,
                },
              },
            }
          : {}),
        ...(schoolId
          ? {
              school: {
                connect: {
                  id: schoolId,
                },
              },
            }
          : {}),
      },
    });

    res.status(201).json({
      organization,
    });
  }
);

router.get(
  "/:schoolId/users",
  requireAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { userId } = req.session;
    const roomId = req.params.roomId;
    await validateRoomAdmin({
      userId: userId as string,
      roomId,
    });
    const users = await getUsersForRoom({
      id: roomId,
    });
    res.status(200).send({
      users,
    });
  }
);

export default router;
