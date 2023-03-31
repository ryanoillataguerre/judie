import { baseFetch } from "./baseFetch";
import { Message } from "./types/api";

export interface ChatCompletionResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
export const GET_COMPLETION_QUERY = "GET_COMPLETION_QUERY";
export const completionFromQueryMutation = async ({
  query,
  newChat = false,
}: {
  query: string;
  newChat?: boolean;
}): Promise<ChatCompletionResponse> => {
  const response = await baseFetch({
    url: "/chat/completion",
    method: "POST",
    body: { query, newChat },
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
}: {
  name: string;
  email: string;
  password: string;
  receivePromotions: boolean;
}) => {
  const response = await baseFetch({
    url: "/auth/signup",
    method: "POST",
    body: { email, password, name, receivePromotions },
  });
  return response.data;
};
