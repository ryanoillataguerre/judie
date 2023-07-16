import { Prisma, User } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createOrganization = async (
  params: Prisma.OrganizationCreateInput
) => {
  return await dbClient.organization.create({
    data: params,
  });
};

export const getUsersForOrganization = async ({ id }: { id: string }) => {
  const permissionsWithUsers = await dbClient.permission.findMany({
    where: {
      organizationId: id,
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
    if (val.user) {
      return [...acc, val.user];
    }
    return acc;
  }, [] as User[]);
};

export const getOrganizationById = async ({ id }: { id: string }) => {
  return await dbClient.organization.findUnique({
    where: {
      id,
    },
    include: {
      schools: true,
      rooms: true,
    },
  });
};

export const getInvitesForOrganization = async ({ id }: { id: string }) => {
  return await dbClient.invite.findMany({
    where: {
      permissions: {
        some: {
          organizationId: id,
        },
      },
    },
    include: {
      permissions: true,
    },
  });
};
