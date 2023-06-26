import { Chat, Message } from "@prisma/client";

export type ChatAndMessageResponse = Chat & { messages: Message[] };
