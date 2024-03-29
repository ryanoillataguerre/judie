import { PermissionType, Prisma, User } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createRoom = async (params: Prisma.RoomCreateArgs) => {
  return await dbClient.room.create(params);
};

export const getUsersForRoom = async ({ id }: { id: string }) => {
  const permissionsWithUsers = await dbClient.permission.findMany({
    where: {
      roomId: id,
      userId: {
        not: null,
      },
      deletedAt: null,
      type: {
        not: PermissionType.ROOM_ADMIN,
      },
    },
    include: {
      user: {
        include: {
          permissions: true,
        },
      },
    },
  });
  const userIdMap: { [key: string]: boolean } = {};
  return permissionsWithUsers.reduce((acc, val) => {
    if (val.user?.id && userIdMap[val.user?.id]) {
      return acc;
    }
    if (val.user) {
      userIdMap[val.user.id] = true;
      return [...acc, val.user];
    }
    return acc;
  }, [] as User[]);
};

export const getRoomById = async ({ id }: { id: string }) => {
  return await dbClient.room.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
    },
  });
};

export const getInvitesForRoom = async ({ id }: { id: string }) => {
  return await dbClient.invite.findMany({
    where: {
      permissions: {
        some: {
          roomId: id,
          deletedAt: null,
        },
      },
    },
    include: {
      permissions: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

export const deleteRoomById = async ({ id }: { id: string }) => {
  return await dbClient.room.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const updateRoom = async (
  roomId: string,
  params: Prisma.RoomUpdateInput
) => {
  const newRoom = await dbClient.room.update({
    where: {
      id: roomId,
    },
    data: params,
  });
  return newRoom;
};
