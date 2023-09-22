import { Permission, PermissionType, Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

export const createPermission = async (
  params: Prisma.PermissionCreateInput
) => {
  const permission = await dbClient.permission.create({
    data: params,
  });
  return permission;
};

export const getPermissionsById = async ({ id }: { id: string }) => {
  return await dbClient.permission.findMany({
    where: {
      id,
    },
  });
};

export const deletePermissionById = async ({ id }: { id: string }) => {
  return await dbClient.permission.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const updatePermissionById = async (
  permissionId: string,
  params: Prisma.PermissionUpdateInput
) => {
  return await dbClient.permission.update({
    where: {
      id: permissionId,
    },
    data: params,
  });
};

export const validateUserAdminForPermission = async ({
  permissionId,
  userId,
}: {
  permissionId: string;
  userId: string;
}) => {
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      permissions: true,
    },
  });
  const userPermissions = user?.permissions;
  const permission = await dbClient.permission.findUnique({
    where: {
      id: permissionId,
    },
  });
  // If permission is org-level, can the user admin the org?
  const isOrgLevelPermission =
    permission?.organizationId &&
    !permission?.schoolId &&
    !permission?.roomId &&
    permission.type === PermissionType.ORG_ADMIN;
  if (isOrgLevelPermission) {
    // Find if user can admin this org
    const userCanAdminOrg = userPermissions?.some(
      (userPermission) =>
        userPermission.organizationId === permission.organizationId &&
        userPermission.type === PermissionType.ORG_ADMIN
    );
    if (!userCanAdminOrg) {
      throw new UnauthorizedError("Permission denied");
    }
  }

  // If permission is school-level, can the user admin the school?
  const isSchoolLevelPermission =
    permission?.schoolId &&
    !permission?.roomId &&
    permission.type === PermissionType.SCHOOL_ADMIN;
  if (isSchoolLevelPermission) {
    // Find if user can admin this school
    const userCanAdminSchool = userPermissions?.some(
      (userPermission) =>
        (userPermission.schoolId === permission.schoolId &&
          userPermission.type === PermissionType.SCHOOL_ADMIN) ||
        (userPermission.type === PermissionType.ORG_ADMIN &&
          userPermission.organizationId === permission.organizationId)
    );
    if (!userCanAdminSchool) {
      throw new UnauthorizedError("Permission denied");
    }
  }

  // If permission is room-level, can the user admin the room?
  const isRoomLevelPermission =
    (!!permission?.roomId && permission.type === PermissionType.ROOM_ADMIN) ||
    (!!permission?.roomId && permission?.type === PermissionType.STUDENT);
  if (isRoomLevelPermission) {
    // Find if user can admin this room
    const userCanAdminRoom = userPermissions?.some(
      (userPermission) =>
        (userPermission.roomId === permission?.roomId &&
          userPermission.type === PermissionType.ROOM_ADMIN) ||
        (userPermission.type === PermissionType.SCHOOL_ADMIN &&
          userPermission.schoolId === permission?.schoolId) ||
        (userPermission.type === PermissionType.ORG_ADMIN &&
          userPermission.organizationId === permission?.organizationId)
    );
    if (!userCanAdminRoom) {
      throw new UnauthorizedError("Permission denied");
    }
  }
};
