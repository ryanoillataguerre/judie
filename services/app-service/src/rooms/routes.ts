import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  createRoom,
  deleteRoomById,
  getInvitesForRoom,
  getRoomById,
  getUsersForRoom,
  updateRoom,
} from "./service.js";
import { validateRoomAdmin, validateSchoolAdmin } from "../admin/service.js";
import { createPermission } from "../permissions/service.js";
import { PermissionType } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().exists(),
    body("organizationId").isString().exists(),
    body("schoolId").isString().optional(),
  ],
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { name, schoolId, organizationId } = req.body;
    // Validate user has organization-level privileges
    if (schoolId) {
      await validateSchoolAdmin({
        userId: req.userId as string,
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
          id: req.userId,
        },
      },
    });

    res.status(201).json({
      data: room,
    });
  })
);

router.get(
  "/:roomId/users",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
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
  })
);

router.get(
  "/:roomId",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
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
  })
);

router.get(
  "/:roomId/invites",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const roomId = req.params.roomId;
    await validateRoomAdmin({
      userId: userId as string,
      roomId,
    });
    const users = await getInvitesForRoom({
      id: roomId,
    });
    res.status(200).send({
      data: users,
    });
  })
);

router.delete(
  "/:roomId",
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const userId = req.userId;
    const roomId = req.params.roomId;
    const room = await getRoomById({
      id: roomId,
    });
    if (room?.schoolId) {
      await validateSchoolAdmin({
        userId: userId as string,
        schoolId: room.schoolId,
      });
    } else {
      throw new UnauthorizedError("User is not authorized to delete this room");
    }
    await deleteRoomById({
      id: roomId,
    });
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

router.put(
  "/:roomId",
  [body("name").isString().exists()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = req.userId;

    await validateRoomAdmin({
      userId: userId as string,
      roomId: req.params.roomId,
    });

    const school = await updateRoom(req.params.roomId, {
      name,
    });

    res.status(201).json({
      data: school,
    });
  })
);

export default router;
