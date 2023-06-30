import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createOrganization = async (
  params: Prisma.OrganizationCreateInput
) => {
  return await dbClient.organization.create({
    data: params,
  });
};

export const getUsersForOrganization = async ({ id }: { id: string }) => {
  return await dbClient.user.findMany({
    where: {
      permissions: {
        some: {
          organizationId: id,
        },
      },
    },
  });
};

export const getOrganizationById = async ({ id }: { id: string }) => {
  return await dbClient.organization.findUnique({
    where: {
      id,
    },
    include: {
      schools: true,
      rooms: true,
      users: true,
    },
  });
};
