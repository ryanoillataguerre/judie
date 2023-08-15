import { Prisma, User } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createSchool = async (params: Prisma.SchoolCreateInput) => {
  return dbClient.school.create({
    data: params,
  });
};

export const getUsersForSchool = async ({ id }: { id: string }) => {
  const permissionsWithUsers = await dbClient.permission.findMany({
    where: {
      schoolId: id,
      deletedAt: null,
      userId: {
        not: null,
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
    if (val.user?.id) {
      userIdMap[val.user.id] = true;
      return [...acc, val.user];
    }
    return acc;
  }, [] as User[]);
};

export const getSchoolById = async ({ id }: { id: string }) => {
  return await dbClient.school.findUnique({
    where: {
      id,
    },
    include: {
      rooms: true,
      users: true,
    },
  });
};

export const getInvitesForSchool = async ({ id }: { id: string }) => {
  return await dbClient.invite.findMany({
    where: {
      deletedAt: null,
      permissions: {
        some: {
          schoolId: id,
        },
      },
    },
    include: {
      permissions: true,
    },
  });
};
