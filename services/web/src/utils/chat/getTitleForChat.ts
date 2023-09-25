import { Chat } from "@judie/data/types/api";

export const getTitleForChat = (chat: Chat, charLength?: number) => {
  if (!charLength) {
    charLength = 14;
  }

  if (chat.userTitle) {
    const result = chat.userTitle.slice(0, charLength);
    if (result.length === charLength) {
      return result + "...";
    }
    return result;
  }
  if (chat.subject) {
    const result = chat.subject.slice(0, charLength);
    if (result.length === charLength) {
      return result + "...";
    }
    return result;
  }
  return "Untitled";
};
