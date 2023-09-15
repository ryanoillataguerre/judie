import { Permission, Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createPermission = async (
  params: Prisma.PermissionCreateInput
) => {
  const permission = await dbClient.permission.create({
    data: params,
  });
  return permission;
};

export const getPermissionsById = async ({ id }: { id: string }) => {
  return await dbClient.permission.findMany({
    where: {
      id,
    },
  });
};

export const deletePermissionById = async ({ id }: { id: string }) => {
  return await dbClient.permission.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
