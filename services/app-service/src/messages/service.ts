import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const getMessageById = async (id: string) => {
  return await dbClient.message.findUnique({
    where: {
      id,
    },
  });
};

export const updateMessage = async (
  messageId: string,
  params: Prisma.MessageUpdateInput
) => {
  const newMessage = await dbClient.message.update({
    where: {
      id: messageId,
    },
    data: params,
  });
  return newMessage;
};
