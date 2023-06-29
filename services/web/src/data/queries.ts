import { baseFetch } from "./baseFetch";
import { ChatResponse } from "./mutations";
import { Invite, Organization, User } from "./types/api";

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

export const GET_PORTAL_LINK = "GET_PORTAL_LINK";
export const getBillingPortalLinkQuery = async (): Promise<string> => {
  const response = await baseFetch({
    url: `/user/billing-portal-link`,
    method: "GET",
  });
  return response.data;
};

export const GET_INVITE_BY_ID = "GET_INVITE_BY_ID";
export const getInviteByIdQuery = async (id: string): Promise<Invite> => {
  const response = await baseFetch({
    url: `/invites/${id}`,
    method: "GET",
  });
  return response.data;
};

export const GET_ORG_BY_ID = "GET_ORG_BY_ID";
export const getOrgByIdQuery = async (id: string): Promise<Organization> => {
  const response = await baseFetch({
    url: `/organizations/${id}`,
    method: "GET",
  });
  return response.data;
};
