import { baseFetch } from "./baseFetch";
import { ChatCompletionResponse } from "./mutations";
import { User } from "./types/api";

export const GET_ME = "GET_ME";
export const getMeQuery = async (): Promise<User> => {
  const response = await baseFetch({
    url: "/user/me",
    method: "GET",
  });
  return response.data;
};

export const GET_ACTIVE_CHAT = "GET_ACTIVE_CHAT";
export const getUserActiveChatQuery =
  async (): Promise<ChatCompletionResponse> => {
    const response = await baseFetch({
      url: "/chat/active",
      method: "GET",
    });
    return response.data;
  };

export const GET_USER_CHATS = "GET_USER_CHATS";
export const getUserChatsQuery = async (): Promise<
  ChatCompletionResponse[]
> => {
  const response = await baseFetch({
    url: "/chat",
    method: "GET",
  });
  return response.data;
};
