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
  return permissionsWithUsers.reduce((acc, val) => {
    if (val.user) {
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
      permissions: {
        some: {
          schoolId: id,
        },
      },
    },
  });
};
