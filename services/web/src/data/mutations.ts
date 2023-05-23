import { baseFetch } from "./baseFetch";
import { Chat, Message, UserRole } from "./types/api";

export interface ChatResponse {
  id: string;
  userTitle?: string;
  subject?: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
export const GET_COMPLETION_QUERY = "GET_COMPLETION_QUERY";
export const completionFromQueryMutation = async ({
  query,
  chatId,
  setChatValue,
  onStreamEnd,
}: {
  query: string;
  chatId: string;
  setChatValue: (chat: string) => void;
  onStreamEnd?: () => void;
}): Promise<string> => {
  const response = await baseFetch({
    url: `/chat/completion?chatId=${chatId}`,
    method: "POST",
    body: { query },
    stream: true,
    onChunkReceived: (chunk) => {
      setChatValue(chunk);
    },
    onStreamEnd,
  });
  return response;
};

export const signinMutation = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await baseFetch({
    url: "/auth/signin",
    method: "POST",
    body: { email, password },
  });
  return response.data;
};

export const signupMutation = async ({
  firstName,
  lastName,
  email,
  password,
  receivePromotions,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  receivePromotions: boolean;
}) => {
  const response = await baseFetch({
    url: "/auth/signup",
    method: "POST",
    body: {
      email,
      password,
      firstName,
      lastName,
      receivePromotions,
    },
  });
  return response.data;
};

export const createChatMutation = async (): Promise<ChatResponse> => {
  const response = await baseFetch({
    url: "/chat",
    method: "POST",
  });
  return response.data;
};

export const putChatMutation = async ({
  chatId,
  subject,
  userTitle,
}: {
  chatId: string;
  subject?: string;
  userTitle?: string;
}): Promise<ChatResponse> => {
  const response = await baseFetch({
    url: `/chat/${chatId}`,
    method: "PUT",
    body: {
      subject,
      userTitle,
    },
  });
  return response.data;
};

export const CREATE_CHECKOUT_SESSION = "CREATE_CHECKOUT_SESSION";
export const createCheckoutSessionMutation = async (
  currentUrl: string
): Promise<string> => {
  const response = await baseFetch({
    url: `/payments/checkout-session`,
    method: "POST",
    body: {
      currentUrl,
    },
  });
  return response.data;
};

export const DELETE_CHAT = "DELETE_CHAT";
export const deleteChatMutation = async (chatId: string) => {
  const response = await baseFetch({
    url: `/chat/${chatId}`,
    method: "DELETE",
  });
  return response.data;
};

// Waitlist
export const waitlistMutation = async ({ email }: { email: string }) => {
  const response = await baseFetch({
    url: "/auth/waitlist",
    method: "POST",
    body: { email },
  });
  return response.data;
};
