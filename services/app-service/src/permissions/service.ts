import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createPermission = async (
  params: Prisma.UserPermissionCreateInput
) => {
  const permission = await dbClient.userPermission.create({
    data: params,
  });
  return permission;
};
