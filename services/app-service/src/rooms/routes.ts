import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  handleValidationErrors,
  requireAuth,
  requireJudieAuth,
} from "../utils/express.js";
import { createRoom, getRoomById, getUsersForRoom } from "./service.js";
import {
  validateOrganizationAdmin,
  validateRoomAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";
import { createPermission } from "../permissions/service.js";
import { PermissionType } from "@prisma/client";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("organizationId").isString().exists(),
    body("schoolId").isString().optional(),
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
    const room = await createRoom({
      data: {
        name,
        organization: {
          connect: {
            id: organizationId,
          },
        },
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

    await createPermission({
      type: PermissionType.ROOM_ADMIN,
      organization: {
        connect: {
          id: room.organizationId,
        },
      },
      school: {
        connect: {
          id: schoolId,
        },
      },
      room: {
        connect: {
          id: room.id,
        },
      },
      user: {
        connect: {
          id: req.session.userId,
        },
      },
    });

    res.status(201).json({
      data: room,
    });
  }
);

router.get(
  "/:roomId/users",
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
      data: users,
    });
  }
);

router.get(
  "/:roomId",
  requireAuth,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { userId } = req.session;
    const roomId = req.params.roomId;
    await validateRoomAdmin({
      userId: userId as string,
      roomId,
    });
    const users = await getRoomById({
      id: roomId,
    });
    res.status(200).send({
      data: users,
    });
  }
);

export default router;
