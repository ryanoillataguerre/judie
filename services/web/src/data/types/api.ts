export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  receivePromotions: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export enum MessageType {
  BOT = "BOT",
  USER = "USER",
  SYSTEM = "SYSTEM",
}
export interface Message {
  id: string;
  content: string;
  readableContent: string;
  type: MessageType;
  chatId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Chat {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  messages: Message[];
}
