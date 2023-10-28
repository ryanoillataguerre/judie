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
      deletedAt: null,
    },
    select: {
      id: true,
      userTitle: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      _count: {
        select: {
          chats: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return folders;
};

export const getFolderById = (id: string) => {
  return dbClient.chatFolder.findUnique({
    where: {
      id,
    },
    include: {
      chats: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

export const deleteFolderById = async (id: string) => {
  const deletedFolder = await dbClient.chatFolder.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  return deletedFolder;
};
