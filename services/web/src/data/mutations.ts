import { baseFetch } from "./baseFetch";
import { Message, UserRole } from "./types/api";

export interface ChatResponse {
  id: string;
  subject?: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
export const GET_COMPLETION_QUERY = "GET_COMPLETION_QUERY";
export const completionFromQueryMutation = async ({
  query,
  chatId,
}: {
  query: string;
  chatId: string;
}): Promise<ChatResponse> => {
  const response = await baseFetch({
    url: `/chat/completion?chatId=${chatId}`,
    method: "POST",
    body: { query },
  });
  return response.data;
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
  role,
  district,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  receivePromotions: boolean;
  role: UserRole;
  district?: string;
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
      role,
      district,
    },
  });
  return response.data;
};

export const createChatMutation = async () => {
  const response = await baseFetch({
    url: "/chat",
    method: "POST",
  });
  return response.data;
};

export const putChatMutation = async ({
  chatId,
  subject,
}: {
  chatId: string;
  subject?: string;
}): Promise<ChatResponse> => {
  const response = await baseFetch({
    url: `/chat/${chatId}`,
    method: "PUT",
    body: {
      subject,
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
