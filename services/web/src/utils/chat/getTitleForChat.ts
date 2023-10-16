import { Chat } from "@judie/data/types/api";

export const getTitleForChat = (chat: Chat, sliced?: boolean) => {
  if (chat.userTitle) {
    const result = chat.userTitle.slice(0, 14);
    if (result.length === 14) {
      return result + "...";
    }
    return result;
  }

  if (chat.subject) {
    const result = chat.subject.slice(0, 14);
    if (result.length === 14) {
      return result + "...";
    }
    return result;
  }
  return "Untitled";
};
