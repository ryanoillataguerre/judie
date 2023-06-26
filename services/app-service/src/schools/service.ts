import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createSchool = async (params: Prisma.SchoolCreateInput) => {
  return dbClient.school.create({
    data: params,
  });
};

export const getUsersForSchool = async ({ id }: { id: string }) => {
  return await dbClient.user.findMany({
    where: {
      permissions: {
        some: {
          schoolId: id,
        },
      },
    },
  });
};
