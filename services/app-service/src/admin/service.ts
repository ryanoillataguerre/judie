import { PermissionType, Prisma, User, UserRole } from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import dbClient from "../utils/prisma.js";

export const validateOrganizationAdmin = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      permissions: true,
    },
  });
  // God mode
  if (user?.role === UserRole.JUDIE) {
    return;
  }
  const permission = user?.permissions.find((permission) => {
    return (
      permission.organizationId === organizationId &&
      permission.type === PermissionType.ORG_ADMIN
    );
  });
  if (!permission) {
    throw new UnauthorizedError(
      "You do not have permission to perform this action"
    );
  }
  return;
};

export const validateSchoolAdmin = async ({
  userId,
  schoolId,
}: {
  userId: string;
  schoolId: string;
}) => {
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      permissions: true,
    },
  });
  // God mode
  if (user?.role === UserRole.JUDIE) {
    return;
  }
  const permission = user?.permissions.find((permission) => {
    return (
      permission.schoolId === schoolId &&
      permission.type === PermissionType.SCHOOL_ADMIN
    );
  });
  if (!permission) {
    throw new UnauthorizedError(
      "You do not have permission to perform this action"
    );
  }
  return;
};

export const validateRoomAdmin = async ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) => {
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      permissions: true,
    },
  });
  // God mode
  if (user?.role === UserRole.JUDIE) {
    return;
  }
  const permission = user?.permissions.find((permission) => {
    return (
      permission.roomId === roomId &&
      permission.type === PermissionType.ROOM_ADMIN
    );
  });
  if (!permission) {
    throw new UnauthorizedError(
      "You do not have permission to perform this action"
    );
  }
  return;
};

// Necessary? If so, going to be a pain to implement efficiently
// const validateUserViewability = async ({
//   userId,
//   targetUserId,
// }: {
//   userId: string;
//   targetUserId: string;
// }) => {
//   const user = await dbClient.user.findUnique({
//     where: {
//       id: userId,
//     },
//     include: {
//       permissions: true,
//     },
//   });
//   const targetUser = await dbClient.user.findUnique({
//     where: {
//       id: targetUserId,
//     },
//     include: {
//       permissions: true,
//     },
//   });
//   if (!targetUser) {
//     return;
//   }
//   // God mode
//   if (user?.role === UserRole.JUDIE) {
//     return;
//   }
//   // The gods are invisible
//   if (targetUser.role === UserRole.JUDIE) {
//     throw new UnauthorizedError(
//       "You do not have permission to perform this action"
//     );
//   }

//   // Return if:
//   // Any of the user's permissions match the target user's permissions
//   // If permission has only an organizationId, match on that
//   // If permission has a schoolId, match on that
//   // If permission has a roomId, match on that

//   return;
// };

export const getUserAdmin = async (
  params: Prisma.UserWhereUniqueInput
): Promise<User | null> => {
  const user = await dbClient.user.findUnique({
    where: params,
    include: {
      permissions: true,
      chats: true,
      rooms: true,
      schools: true,
      organizations: true,
    },
  });
  return user;
};
