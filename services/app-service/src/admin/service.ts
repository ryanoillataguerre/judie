import {
  MessageType,
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
import { getUser } from "../users/service.js";

const USER_PAGE_SIZE = 20;

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
      permissions: {
        where: {
          deletedAt: null,
        },
      },
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
  const school = await dbClient.school.findUnique({
    where: {
      id: schoolId,
    },
    include: {
      organization: true,
    },
  });
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      permissions: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
  // God mode
  if (user?.role === UserRole.JUDIE) {
    return;
  }
  const permission = user?.permissions.find((permission) => {
    return (
      (permission.schoolId === schoolId &&
        permission.type === PermissionType.SCHOOL_ADMIN) ||
      (permission.organizationId === school?.organizationId &&
        permission.type === PermissionType.ORG_ADMIN)
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
  const room = await dbClient.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      organization: true,
    },
  });
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      permissions: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
  // God mode
  if (user?.role === UserRole.JUDIE) {
    return;
  }
  const permission = user?.permissions.find((permission) => {
    return (
      (permission.roomId === roomId &&
        permission.type === PermissionType.ROOM_ADMIN) ||
      (permission.organizationId === room?.organizationId &&
        permission.type === PermissionType.ORG_ADMIN) ||
      (permission.schoolId === room?.schoolId &&
        permission.type === PermissionType.SCHOOL_ADMIN)
    );
  });
  if (!permission) {
    throw new UnauthorizedError(
      "You do not have permission to perform this action"
    );
  }
  return;
};

export const getUserAdmin = async (
  params: Prisma.UserWhereUniqueInput
): Promise<User | null> => {
  const user = await dbClient.user.findUnique({
    where: params,
    include: {
      permissions: true,
      chats: {
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          messages: {
            where: {
              type: {
                not: MessageType.SYSTEM,
              },
            },
          },
        },
      },
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
  const queryResults = await dbClient.permission.findMany({
    where: {
      userId: id,
      deletedAt: null,
    },
    include: {
      organization: {
        include: {
          schools: {
            where: {
              deletedAt: null,
            },
            include: {
              rooms: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      school: {
        include: {
          rooms: {
            where: {
              deletedAt: null,
            },
          },
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

  const organizationIdMap: { [key: string]: boolean } = {};
  const organizationsFormatted = queryResults?.reduce((acc, permission) => {
    if (
      permission.type === PermissionType.ORG_ADMIN &&
      permission.organization?.id &&
      !organizationIdMap[permission.organization.id] &&
      !permission.organization.deletedAt
    ) {
      acc.push(permission.organization);
      organizationIdMap[permission.organization.id] = true;
    }
    return acc;
  }, [] as ((Organization & { schools: (School & { rooms: Room[] })[] }) | undefined)[]);

  const schoolIdMap: { [key: string]: boolean } = {};
  const schoolsFormatted = queryResults?.reduce((acc, permission) => {
    if (
      permission.type === PermissionType.SCHOOL_ADMIN &&
      permission.school?.id &&
      !schoolIdMap[permission.school.id] &&
      !permission.school.deletedAt
    ) {
      acc.push(permission.school);
      schoolIdMap[permission.school.id] = true;
    }
    return acc;
  }, [] as ((School & { rooms: Room[] }) | undefined)[]);

  const roomIdMap: { [key: string]: boolean } = {};
  const roomsFormatted = queryResults?.reduce((acc, permission) => {
    if (
      permission.type === PermissionType.ROOM_ADMIN &&
      permission.room?.id &&
      !roomIdMap[permission.room.id] &&
      !permission.room.deletedAt
    ) {
      acc.push(permission.room);
      roomIdMap[permission.room.id] = true;
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

  const formattedResults: {
    organizations: (
      | (Organization & { schools: (School & { rooms: Room[] })[] })
      | undefined
    )[];
    schools: ((School & { rooms: Room[] }) | undefined)[];
    rooms: (Room | undefined)[];
  } = {
    organizations: organizationsFormatted,
    schools: schoolsFormatted.filter(
      (school) =>
        school?.id &&
        !organizationSchoolIds.includes(school.id) &&
        !school?.deletedAt
    ),
    rooms: roomsFormatted.filter(
      (room) =>
        room?.id &&
        // !schoolRoomIds.includes(room.id) &&
        !room?.deletedAt
    ),
  };

  return formattedResults;
};

export const getUsersForAdminUser = async ({ id }: { id: string }) => {
  // TODO Ryan: Why is this possibly type never[] ? - Clean this up
  const entities = (await getEntitiesForUser({ id })) as {
    organizations: (
      | (Organization & { schools: (School & { rooms: Room[] })[] })
      | undefined
    )[];
    schools: ((School & { rooms: Room[] }) | undefined)[];
    rooms: (Room | undefined)[];
  };

  const { organizations, schools, rooms } = entities;

  const roomIds: string[] = rooms?.reduce((acc, room) => {
    if (room?.id) {
      return [...acc, room.id];
    }
    return acc;
  }, [] as string[]);
  const schoolIds: string[] = schools?.reduce((acc, school) => {
    if (school?.id) {
      return [...acc, school.id];
    }
    return acc;
  }, [] as string[]);
  const organizationIds: string[] = organizations?.reduce(
    (acc, organization) => {
      if (organization?.id) {
        return [...acc, organization.id];
      }
      return acc;
    },
    [] as string[]
  );

  const userQueryResult = await dbClient.user.findMany({
    where: {
      permissions: {
        some: {
          deletedAt: null,
          OR: [
            {
              roomId: {
                in: roomIds,
              },
            },
            {
              schoolId: {
                in: schoolIds,
              },
            },
            {
              organizationId: {
                in: organizationIds,
              },
            },
          ],
        },
      },
    },
    // skip: page * USER_PAGE_SIZE,
    // take: USER_PAGE_SIZE,
  });

  return userQueryResult;
};

export const getUsage = async () => {
  const midnightLastNight = new Date();
  midnightLastNight.setHours(0, 0, 0, 0);

  const daus = await dbClient.user.findMany({
    where: {
      // Filter out employees
      email: {
        not: {
          contains: "@judie.io",
        },
      },
      lastMessageAt: {
        gte: midnightLastNight,
      },
    },
    include: {
      subscription: true,
    },
  });

  const midnightBeginningOfMonth = new Date();
  midnightBeginningOfMonth.setDate(1);
  midnightBeginningOfMonth.setHours(0, 0, 0, 0);

  const maus = await dbClient.user.findMany({
    where: {
      // Filter out employees
      email: {
        not: {
          contains: "@judie.io",
        },
      },
      lastMessageAt: {
        gte: midnightBeginningOfMonth,
      },
    },
    include: {
      subscription: true,
    },
  });

  return {
    daily: {
      date: midnightLastNight.toISOString(),
      count: daus.length,
      users: daus,
    },
    monthly: {
      date: midnightBeginningOfMonth.toISOString(),
      count: maus.length,
      users: maus,
    },
  };
};
