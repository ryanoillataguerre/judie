import { Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createFolder = async (params: Prisma.ChatFolderCreateInput) => {
  const newChat = await dbClient.chatFolder.create({
    data: {
      ...params,
    },
  });
  return newChat;
};
