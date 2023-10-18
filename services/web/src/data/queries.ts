import { baseFetch } from "./baseFetch";
import {
  Chat,
  ChatFolder,
  EntitiesResponse,
  Invite,
  Organization,
  Permission,
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
export const getUserChatsQuery = async (): Promise<Chat[]> => {
  const response = await baseFetch({
    url: "/chat",
    method: "GET",
  });
  return response.data;
};

export const GET_CHAT_BY_ID = "GET_CHAT_BY_ID";
export const getChatByIdQuery = async (id: string): Promise<Chat> => {
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

export const GET_PERMISSIONS_BY_ID = "GET_PERMISSIONS_BY_ID";
export const getPermissionsByIdQuery = async (
  user_id?: string
): Promise<Permission[]> => {
  const response = await baseFetch({
    url: `/user/${user_id}/permissions`,
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

export const GET_USERS_FOR_ADMIN_USER = "GET_USERS_FOR_ADMIN_USER";
export const getUsersForAdminUserQuery = async (): Promise<User[]> => {
  const response = await baseFetch({
    url: `/admin/users`,
    method: "GET",
  });
  return response.data;
};

export const GET_USERS_FOR_ORG = "GET_USERS_FOR_ORG";
export const getUsersForOrgQuery = async (id: string): Promise<User[]> => {
  const response = await baseFetch({
    url: `/admin/organizations/${id}/users`,
    method: "GET",
  });
  return response.data;
};

export const GET_USERS_FOR_SCHOOL = "GET_USERS_FOR_SCHOOL";
export const getUsersForSchoolQuery = async (id: string): Promise<User[]> => {
  const response = await baseFetch({
    url: `/admin/schools/${id}/users`,
    method: "GET",
  });
  return response.data;
};

export const GET_USERS_FOR_ROOM = "GET_USERS_FOR_ROOM";
export const getUsersForRoomQuery = async (id: string): Promise<User[]> => {
  const response = await baseFetch({
    url: `/admin/rooms/${id}/users`,
    method: "GET",
  });
  return response.data;
};

export const GET_INVITES_FOR_ORG = "GET_INVITES_FOR_ORG";
export const getInvitesForOrgQuery = async (id: string): Promise<Invite[]> => {
  const response = await baseFetch({
    url: `/admin/organizations/${id}/invites`,
    method: "GET",
  });
  return response.data;
};

export const GET_INVITES_FOR_SCHOOL = "GET_INVITES_FOR_SCHOOL";
export const getInvitesForSchoolQuery = async (
  id: string
): Promise<Invite[]> => {
  const response = await baseFetch({
    url: `/admin/schools/${id}/invites`,
    method: "GET",
  });
  return response.data;
};

export const GET_INVITES_FOR_ROOM = "GET_INVITES_FOR_ROOM";
export const getInvitesForRoomQuery = async (id: string): Promise<Invite[]> => {
  const response = await baseFetch({
    url: `/admin/rooms/${id}/invites`,
    method: "GET",
  });
  return response.data;
};

export const GET_USER_BY_ID = "GET_USER_BY_ID";
export const getUserByIdQuery = async (id: string): Promise<User> => {
  const response = await baseFetch({
    url: `/admin/users/${id}`,
    method: "GET",
  });
  return response.data;
};

export const MESSAGE_BY_ID = "MESSAGE_BY_ID";
export const getMessageByIdQuery = async (id: string): Promise<any> => {
  const response = await baseFetch({
    url: `/messages/${id}`,
    method: "GET",
  });
  return response.data;
};

export const GET_USER_FOLDERS = "GET_USER_FOLDERS";
export const getUserFoldersQuery = async (): Promise<ChatFolder[]> => {
  const response = await baseFetch({
    url: `/folders`,
    method: "GET",
  });
  return response.data;
};

export const GET_FOLDER_BY_ID = "GET_FOLDER_BY_ID";
export const getFolderByIdQuery = async ({
  id,
}: {
  id: string;
}): Promise<ChatFolder> => {
  const response = await baseFetch({
    url: `/folders/${id}`,
    method: "GET",
  });
  return response.data;
};

interface SuperUsageResponse {
  daily: {
    date: string;
    count: number;
    users: User[];
  };
  monthly: {
    date: string;
    count: number;
    users: User[];
  };
}
export const GET_SUPER_USAGE = "GET_SUPER_USAGE";
export const getSuperUsageQuery = async (): Promise<SuperUsageResponse> => {
  const response = await baseFetch({
    url: `/admin/usage`,
    method: "GET",
  });
  return response.data;
};
