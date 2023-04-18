import { baseFetch } from "./baseFetch";
import { Message, UserRole } from "./types/api";

export interface ChatResponse {
  id: string;
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
  name,
  email,
  password,
  receivePromotions,
  role,
  district,
}: {
  name: string;
  email: string;
  password: string;
  receivePromotions: boolean;
  role: UserRole;
  district?: string;
}) => {
  const response = await baseFetch({
    url: "/auth/signup",
    method: "POST",
    body: { email, password, name, receivePromotions, role, district },
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
