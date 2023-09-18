import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import { deletePermissionById } from "./service.js";
import {
  validateOrganizationAdmin,
  validateSchoolAdmin,
} from "../admin/service.js";
import { createPermission } from "../permissions/service.js";
import { PermissionType } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

const router = Router();

router.post(
  "/",
  [
    body("userId").isString().exists(),
    body("organizationId").isString().exists(),
  ],
  // Only Judie employees can create organizations
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { userId, type, roomId, organizationId, schoolId } = req.body;

    const permissonObj = {
      type: type as PermissionType,
      ...(organizationId &&
        organizationId != "None" && {
          organization: {
            connect: {
              id: organizationId,
            },
          },
        }),
      ...(schoolId &&
        schoolId != "None" && {
          school: {
            connect: {
              id: schoolId,
            },
          },
        }),
      ...(roomId &&
        roomId != "None" && {
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
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const { userId } = req.session;
    const permissionId = req.params.permissionId;
    // const permission = await getPermissionById({
    //   id: permissionId,
    // });
    // if (permission?.organizationId) {
    //   await validateOrganizationAdmin({
    //     userId: userId as string,
    //     organizationId: permission.organizationId,
    //   });
    // } else {
    //   throw new UnauthorizedError(
    //     "User is not authorized to delete this permission"
    //   );
    // }
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

export default router;
