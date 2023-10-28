import { Chat } from "@judie/data/types/api";

export const getTitleForChat = (chat: Chat, sliced?: boolean) => {
  if (!chat.userTitle && chat.messages?.length === 0) {
    return "Untitled";
  }
  if (!chat.userTitle && chat.messages?.length > 0) {
    const result = chat.messages?.[0]?.readableContent.slice(0, 30);
    if (sliced) {
      return `${result.slice(0, 14)}...`;
    }
    return result;
  }
  if (chat.userTitle) {
    if (sliced) {
      return `${chat.userTitle.slice(0, 14)}...`;
    }
    return chat.userTitle;
  }
  return "Untitled";
};
