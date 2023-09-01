import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createPermission = async (
  params: Prisma.PermissionCreateInput
) => {
  const permission = await dbClient.permission.create({
    data: params,
  });
  return permission;
};
