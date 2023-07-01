import { baseFetch } from "./baseFetch";
import { ChatResponse } from "./mutations";
import {
  EntitiesResponse,
  Invite,
  Organization,
  Room,
  School,
  User,
} from "./types/api";

export const GET_ME = "GET_ME";
export const getMeQuery = async ({
  isAdmin = false,
}: {
  isAdmin: boolean;
}): Promise<User> => {
  const response = await baseFetch({
    url: `/user/me?admin=${isAdmin}`,
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
    url: `/admin/organizations/${id}`,
    method: "GET",
  });
  return response.data;
};

export const GET_SCHOOL_BY_ID = "GET_SCHOOL_BY_ID";
export const getSchoolByIdQuery = async (id: string): Promise<School> => {
  const response = await baseFetch({
    url: `/admin/schools/${id}`,
    method: "GET",
  });
  return response.data;
};

export const GET_ROOM_BY_ID = "GET_ROOM_BY_ID";
export const getRoomByIdQuery = async (id: string): Promise<Room> => {
  const response = await baseFetch({
    url: `/admin/rooms/${id}`,
    method: "GET",
  });
  return response.data;
};

export const GET_USER_ENTITIES = "GET_USER_ENTITIES";
export const getUserEntitiesQuery = async (): Promise<EntitiesResponse> => {
  const response = await baseFetch({
    url: `/admin/entities`,
    method: "GET",
  });
  return response.data;
};
