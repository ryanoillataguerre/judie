import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import {
  deletePermissionById,
  updatePermissionById,
  validateUserAdminForPermission,
} from "./service.js";
import {
  validateOrganizationAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";
import { createPermission } from "../permissions/service.js";
import { PermissionType } from "@prisma/client";

const router = Router();

router.post(
  "/",
  [
    body("userId").isString().exists(),
    body("type").isString().exists(),
    body("organizationId").isString().exists(),
    body("schoolId").isString().exists(),
    body("roomId").isString().exists(),
  ],
  // Only Judie employees can create organizations
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { userId, type, roomId, organizationId, schoolId } = req.body;

    const permissonObj = {
      type: type as PermissionType,
      ...(organizationId != "None" && {
        organization: {
          connect: {
            id: organizationId,
          },
        },
      }),
      ...(schoolId != "None" && {
        school: {
          connect: {
            id: schoolId,
          },
        },
      }),
      ...(roomId != "None" && {
        room: {
          connect: {
            id: roomId,
          },
        },
      }),

      user: {
        connect: {
          id: userId,
        },
      },
    };

    let newPermission = await createPermission(permissonObj);

    res.status(201).json({
      data: newPermission,
    });
  })
);

router.delete(
  "/:permissionId",
  [param("permissionId").exists()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const permissionId = req.params.permissionId;
    const userId = req.userId;
    // Validate if user can delete this permission
    await validateUserAdminForPermission({
      userId: userId as string,
      permissionId,
    });
    await deletePermissionById({
      id: permissionId,
    });
    res.status(200).send({
      data: {
        success: true,
      },
    });
  })
);

router.put(
  "/:permissionId",
  [
    param("permissionId").exists(),
    body("type").isString().exists(),
    body("organizationId").isString().exists(),
    body("schoolId").isString().exists(),
    body("roomId").isString().exists(),
    body("selectedUserId").isString().exists(),
  ],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const permissionId = req.params.permissionId;
    const { selectedUserId, type, organizationId, schoolId, roomId } = req.body;

    const permission = await updatePermissionById(permissionId, {
      type: type as PermissionType,

      organization:
        organizationId != "None"
          ? {
              connect: {
                id: organizationId,
              },
            }
          : {
              disconnect: true,
            },

      school:
        schoolId != "None"
          ? {
              connect: {
                id: schoolId,
              },
            }
          : {
              disconnect: true,
            },

      room:
        roomId != "None"
          ? {
              connect: {
                id: roomId,
              },
            }
          : {
              disconnect: true,
            },

      user: {
        connect: {
          id: selectedUserId,
        },
      },
    });

    res.status(201).json({
      data: permission,
    });
  })
);

export default router;
