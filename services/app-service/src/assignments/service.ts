import { CHAT_TAGS, updateChat } from "../chats/service.js";
import dbClient from "../utils/prisma.js";

export const createChatAssignment = async ({
  chatId,
  text,
}: {
  chatId: string;
  text: string;
}) => {
  const assignment = await dbClient.chatAssignment.create({
    data: {
      chatId,
      text,
    },
  });

  // Add tag to chat
  await updateChat(chatId, {
    tags: {
      push: CHAT_TAGS.ASSIGNMENT,
    },
  });

  return assignment;
};
