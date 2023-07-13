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
  const permissionsWithUsers = await dbClient.userPermission.findMany({
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
  return permissionsWithUsers.reduce((acc, val) => {
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
      invites: true,
    },
  });
};
