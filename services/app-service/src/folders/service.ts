import { ChatFolder, Prisma } from "@prisma/client";
import dbClient from "../utils/prisma.js";

export const createFolder = async (params: Prisma.ChatFolderCreateInput) => {
  const newChatFolder: ChatFolder = await dbClient.chatFolder.create({
    data: {
      ...params,
    },
  });
  return newChatFolder;
};

export const updateFolder = async (
  folderId: string,
  params: Prisma.ChatFolderUpdateInput
) => {
  const newChatFolder = await dbClient.chatFolder.update({
    data: {
      ...params,
    },
    where: {
      id: folderId,
    },
  });
  return newChatFolder;
};

export const getUserFoldersWithChatCounts = async (userId: string) => {
  const folders = await dbClient.chatFolder.findMany({
    where: {
      userId,
    },
    select: {
      _count: {
        select: {
          chats: true,
        },
      },
    },
  });
  return folders;
};
