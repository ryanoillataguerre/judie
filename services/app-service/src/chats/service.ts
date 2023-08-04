import { InternalError, NotFoundError } from "../utils/errors/index.js";
import { PineconeClient, QueryRequest } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import dbClient from "../utils/prisma.js";
import { Chat, Message, MessageType, Prisma } from "@prisma/client";
import { ChatAndMessageResponse } from "./types.js";
import { subjectToNamespaceMap, subjectToPromptMap } from "./consts.js";
import { IncomingMessage } from "http";
import { Response } from "express";
import { getChatCompletion } from "../inference/service.js";

// Chat Service
export const createChat = async (params: Prisma.ChatCreateInput) => {
  const newChat = await dbClient.chat.create({
    data: {
      ...params,
    },
    include: {
      messages: true,
    },
  });
  return newChat;
};

export const deleteChat = async (chatId: string) => {
  if (!chatId) {
    throw new InternalError("Chat ID not provided");
  }

  const chat = await dbClient.chat.update({
    where: {
      id: chatId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  return chat;
};

export const deleteChatsForUser = async (userId: string) => {
  if (!userId) {
    throw new InternalError("User ID not provided");
  }
  await dbClient.chat.updateMany({
    where: {
      userId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const updateChat = async (
  chatId: string,
  params: Prisma.ChatUpdateInput
) => {
  const newChat = await dbClient.chat.update({
    where: {
      id: chatId,
    },
    data: params,
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          type: {
            not: MessageType.SYSTEM,
          },
        },
      },
    },
  });
  return newChat;
};

export const getChat = async (params: Prisma.ChatWhereUniqueInput) => {
  const chat = await dbClient.chat.findFirst({
    where: {
      ...params,
      deletedAt: null,
    },
    include: {
      messages: {
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          type: {
            not: MessageType.SYSTEM,
          },
        },
      },
    },
  });
  return chat;
};

export const getChatInternal = async (params: Prisma.ChatWhereUniqueInput) => {
  const chat = await dbClient.chat.findUnique({
    where: params,
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return chat;
};

export const getUserChats = async (userId: string) => {
  const chats = await dbClient.chat.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      messages: {
        take: 1,
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          type: {
            not: MessageType.SYSTEM,
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return chats;
};

export const getCompletion = async ({
  chatId,
  query,
  userId,
  response,
}: {
  chatId?: string;
  query: string;
  userId: string;
  response: Response;
}) => {
  let chat: Chat & { messages: Message[] };
  if (!chatId) {
    chat = await createChat({
      user: { connect: { id: userId } },
    });
  } else {
    const existingChat = await getChat({
      id: chatId as string,
    });
    if (existingChat) {
      chat = existingChat;
    } else {
      throw new NotFoundError("Could not find chat");
    }
  }

  // Add message to chat
  await createMessage({
    readableContent: query,
    content: query,
    type: MessageType.USER,
    chat: {
      connect: {
        id: chat.id,
      },
    },
  });

  // If message ends up being created, we can set createdAt to be the same as the message start
  const createdAt = new Date();
  // Send request to inference service
  const completionText = await getChatCompletion({
    chatId: chat.id,
    response,
  });
  // Save message to chat
  const latestChat = await updateChat(chat.id, {
    messages: {
      create: {
        content: completionText,
        readableContent: completionText,
        type: MessageType.BOT,
        createdAt,
      },
    },
  });

  return latestChat;
};

export const transformMessageToChatCompletionMessage = (
  message: Message
): ChatCompletionRequestMessage => {
  const { content, type } = message;
  return {
    role: type === MessageType.USER ? "user" : "system",
    content: content,
  };
};

export const createMessage = async (params: Prisma.MessageCreateInput) => {
  const newMessage = await dbClient.message.create({
    data: {
      ...params,
    },
  });
  return newMessage;
};

export const deleteMostRecentChatMessage = async ({
  chatId,
}: {
  chatId: string;
}) => {
  const message = await dbClient.message.findFirst({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!message) {
    console.info("No message found to delete for chat id: ", chatId);
    return;
  }
  await dbClient.message.delete({
    where: {
      id: message.id,
    },
  });
};
