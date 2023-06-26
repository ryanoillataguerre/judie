import { PermissionType, UserRole } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import dbClient from "../utils/prisma.js";

export const validateOrganizationAdmin = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const permission = await dbClient.userPermission.findFirst({
    where: {
      userId,
      organizationId,
    },
  });
  if (!permission) {
    throw new UnauthorizedError(
      "You do not have permission to perform this action"
    );
  }
  return permission.type === PermissionType.ORG_ADMIN;
};
