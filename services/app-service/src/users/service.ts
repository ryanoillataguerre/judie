import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const getUser = async (params: Prisma.UserWhereInput, includeParams?: Prisma.UserInclude) => {
  return await dbClient.user.findFirst({
    where: params,
    include: includeParams || {
      subscription: true,
      chats: {
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
          },
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
