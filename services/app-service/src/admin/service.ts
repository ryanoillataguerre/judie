import { PermissionType, UserRole } from "@prisma/client";
import { getUser } from "../user/service.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

export const validateInviteRights = async ({
  userId,
  organizationId,
  schoolId,
  roomId,
}: {
  userId: string;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}) => {
  const editingUser = await getUser(
    { id: userId },
    {
      permissions: true,
    }
  );
  if (!editingUser) {
    throw new NotFoundError("User not found");
  }
  // If room, can the user edit it?
  // If no room but school, can the user edit it?
  // If no school or room but organization, can the user edit it?
  const roomPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.schoolId === schoolId &&
      permission.roomId === roomId &&
      permission.type === PermissionType.ROOM_ADMIN
  );
  const schoolPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.schoolId === schoolId &&
      permission.type === PermissionType.SCHOOL_ADMIN
  );
  const organizationPermission = editingUser.permissions?.find(
    (permission) =>
      permission.organizationId === organizationId &&
      permission.type === PermissionType.ORG_ADMIN
  );
  if (roomId && !roomPermission) {
    throw new UnauthorizedError("User cannot edit this room");
  }
  if (!roomId && schoolId && !schoolPermission) {
    throw new UnauthorizedError("User cannot edit this school");
  }
  if (!roomId && !schoolId && organizationId && !organizationPermission) {
    throw new UnauthorizedError("User cannot edit this organization");
  }
  return true;
};
