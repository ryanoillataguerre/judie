import {
  Organization,
  PermissionType,
  Prisma,
  Room,
  School,
  SubscriptionStatus,
  SubscriptionType,
  User,
  UserRole,
} from "@prisma/client";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import dbClient from "../utils/prisma.js";

export const isPermissionTypeAdmin = (type: PermissionType) => {
  return (
    type === PermissionType.ORG_ADMIN ||
    type === PermissionType.SCHOOL_ADMIN ||
    type === PermissionType.ROOM_ADMIN
  );
};

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

export const subscribeUser = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  return await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      subscription: {
        create: {
          type: SubscriptionType.SEAT,
          organizationId,
          status: SubscriptionStatus.ACTIVE,
        },
      },
    },
  });
};

export const getEntitiesForUser = async ({ id }: { id: string }) => {
  const queryResults = await dbClient.userPermission.findMany({
    where: {
      userId: id,
    },
    include: {
      organization: {
        include: {
          schools: {
            include: {
              rooms: true,
            },
          },
        },
      },
      school: {
        include: {
          rooms: true,
        },
      },
      room: true,
    },
  });

  const adminQueryResults = queryResults.filter((perm) =>
    isPermissionTypeAdmin(perm.type)
  );

  if (!adminQueryResults.length) {
    return [];
  }

  const organizationsFormatted = queryResults?.reduce((acc, permission) => {
    if (
      permission.type === PermissionType.ORG_ADMIN &&
      permission.organization?.id
    ) {
      acc.push(permission.organization);
    }
    return acc;
  }, [] as ((Organization & { schools: (School & { rooms: Room[] })[] }) | undefined)[]);

  const schoolsFormatted = queryResults?.reduce((acc, permission) => {
    if (
      permission.type === PermissionType.SCHOOL_ADMIN &&
      permission.school?.id
    ) {
      acc.push(permission.school);
    }
    return acc;
  }, [] as ((School & { rooms: Room[] }) | undefined)[]);

  const roomsFormatted = queryResults?.reduce((acc, permission) => {
    if (permission.type === PermissionType.ROOM_ADMIN && permission.room?.id) {
      acc.push(permission.room);
    }
    return acc;
  }, [] as (Room | undefined)[]);

  // Filter schools - if they exist in any organizations already, delete from array
  const organizationSchoolIds = organizationsFormatted.reduce((acc, org) => {
    if (org?.schools?.length) {
      return [...acc, ...org.schools.map((school) => school.id)];
    }
    return acc;
  }, [] as (string | undefined)[]);
  // // Filter rooms - if they exist in any schools already, delete from array
  // const schoolRoomIds = schoolsFormatted.reduce((acc, school) => {
  //   if (school?.rooms?.length) {
  //     return [...acc, ...school.rooms.map((room) => room.id)];
  //   }
  //   return acc;
  // }, [] as (string | undefined)[]);

  const formattedResults = {
    organizations: organizationsFormatted,
    schools: schoolsFormatted.filter(
      (school) => school?.id && !organizationSchoolIds.includes(school.id)
    ),
    rooms: roomsFormatted,
  };

  return formattedResults;
};
