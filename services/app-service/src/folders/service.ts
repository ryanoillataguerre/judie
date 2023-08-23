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

export const updateFolder = async (
  folderId: string,
  params: Prisma.ChatFolderUpdateInput
) => {
  const newChat = await dbClient.chatFolder.update({
    data: {
      ...params,
    },
    where: {
      id: folderId,
    },
  });
  return newChat;
};
