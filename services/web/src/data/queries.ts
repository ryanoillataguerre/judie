import { baseFetch } from "./baseFetch";
import { ChatResponse } from "./mutations";
import { User } from "./types/api";

export const GET_ME = "GET_ME";
export const getMeQuery = async (): Promise<User> => {
  const response = await baseFetch({
    url: "/user/me",
    method: "GET",
  });
  return response.data;
};

export const GET_USER_CHATS = "GET_USER_CHATS";
export const getUserChatsQuery = async (): Promise<ChatResponse[]> => {
  const response = await baseFetch({
    url: "/chat",
    method: "GET",
  });
  return response.data;
};

export const GET_CHAT_BY_ID = "GET_CHAT_BY_ID";
export const getChatByIdQuery = async (id: string): Promise<ChatResponse> => {
  const response = await baseFetch({
    url: `/chat/${id}`,
    method: "GET",
  });
  return response.data;
};
