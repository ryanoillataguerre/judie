import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const getUser = async (userId: string) => {
  return await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      chats: {
        include: {
          messages: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
};

export const updateUser = async (
  userId: string,
  data: Prisma.UserUpdateInput
) => {
  return await dbClient.user.update({
    where: {
      id: userId,
    },
    data,
  });
};
