import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const getUser = async (params: Prisma.UserWhereInput) => {
  return await dbClient.user.findFirst({
    where: params,
    include: {
      subscription: true,
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

export const incrementUserQuestionsAsked = async (userId: string) => {
  return await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      questionsAsked: {
        increment: 1,
      },
    },
  });
};
