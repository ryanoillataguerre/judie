import { InviteSheetRole } from "@judie/components/admin/InviteModal";
import { HTTPResponseError, baseFetch, baseFetchFormData } from "./baseFetch";
import { GradeYear, Message, PermissionType, UserRole } from "./types/api";

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
  onError,
  abortController,
}: {
  query: string;
  chatId: string;
  setChatValue: (chat: string) => void;
  onStreamEnd?: () => void;
  onError?: (error: HTTPResponseError) => void;
  abortController?: AbortController;
}): Promise<string> => {
  const response = await baseFetch({
    url: `/chat/completion?chatId=${chatId}`,
    method: "POST",
    body: { query },
    stream: true,
    onChunkReceived: setChatValue,
    onStreamEnd,
    onError,
    abortController,
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

export const forgotPasswordMutation = async ({ email }: { email: string }) => {
  const response = await baseFetch({
    url: "/auth/forgot-password",
    method: "POST",
    body: { email },
  });
  return response.data;
};

export const resetPasswordMutation = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  const response = await baseFetch({
    url: "/auth/reset-password",
    method: "POST",
    body: { password, token },
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
  districtOrSchool,
}: {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  receivePromotions: boolean;
  role: UserRole;
  districtOrSchool?: string;
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
      districtOrSchool,
    },
  });
  return response.data;
};

export const createChatMutation = async ({
  subject,
}: {
  subject?: string | undefined;
}): Promise<ChatResponse> => {
  const response = await baseFetch({
    url: "/chat",
    method: "POST",
    body: {
      subject: subject || undefined,
    },
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

export const DELETE_CHATS = "DELETE_CHATS";
export const clearConversationsMutation = async () => {
  const response = await baseFetch({
    url: `/chat/clear`,
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

// Invite
export const redeemInviteMutation = async ({
  firstName,
  lastName,
  password,
  receivePromotions,
  inviteId,
}: {
  firstName: string;
  lastName: string;
  password: string;
  receivePromotions: boolean;
  inviteId: string;
}) => {
  const response = await baseFetch({
    url: `/invites/${inviteId}/redeem`,
    method: "POST",
    body: { password, firstName, lastName, receivePromotions },
  });
  return response.data;
};

export const createOrgMutation = async ({
  name,
  primaryContactEmail,
  primaryContactFirstName,
  primaryContactLastName,
}: {
  name: string;
  primaryContactEmail: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
}) => {
  const response = await baseFetch({
    url: `/admin/organizations/`,
    method: "POST",
    body: {
      name,
      primaryContactEmail,
      primaryContactFirstName,
      primaryContactLastName,
    },
  });
  return response.data;
};

export const createSchoolMutation = async ({
  organizationId,
  name,
  address,
}: {
  organizationId: string;
  name: string;
  address?: string;
}) => {
  const response = await baseFetch({
    url: `/admin/schools/`,
    method: "POST",
    body: { organizationId, name, address },
  });
  return response.data;
};

export const createRoomMutation = async ({
  organizationId,
  name,
  schoolId,
}: {
  organizationId: string;
  name: string;
  schoolId: string;
}) => {
  const response = await baseFetch({
    url: `/admin/rooms/`,
    method: "POST",
    body: { organizationId, name, schoolId },
  });
  return response.data;
};

export interface CreatePermissionType {
  type: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}
export const createInviteMutation = async ({
  gradeYear,
  email,
  permissions,
}: {
  gradeYear?: GradeYear;
  email: string;
  permissions: CreatePermissionType[];
}) => {
  const response = await baseFetch({
    url: `/admin/invites`,
    method: "POST",
    body: { gradeYear, email, permissions },
  });
  return response.data;
};

export const verifyEmailMutation = async (id: string) => {
  const response = await baseFetch({
    url: `/user/${id}/verify`,
    method: "POST",
  });
  return response.data;
};

interface BEInviteRow {
  email: string;
  role: InviteSheetRole;
  school?: string;
  classroom?: string;
}
export const bulkInviteMutation = async ({
  organizationId,
  invites,
}: {
  organizationId: string;
  invites: BEInviteRow[];
}) => {
  const response = await baseFetch({
    url: `/admin/invites/bulk`,
    method: "POST",
    body: { organizationId, invites },
  });
  return response.data;
};

interface TranscribeResponse {
  transcript: string;
}
export const whisperTranscribeMutation = async ({
  data,
}: {
  data: FormData;
}): Promise<TranscribeResponse> => {
  const response = await baseFetchFormData({
    url: `/chat/whisper/transcribe`,
    form: data,
  });
  return response.data;
};

export const createMessageNarration = async ({
  messageId,
}: {
  messageId: string;
}) => {
  const response = await baseFetch({
    url: `/messages/${messageId}/narrate`,
    method: "POST",
  });
  return response.data;
};

export const deleteRoomMutation = async ({ roomId }: { roomId: string }) => {
  const response = await baseFetch({
    url: `/admin/rooms/${roomId}`,
    method: "DELETE",
  });
  return response.data;
};

export const deleteSchoolMutation = async ({
  schoolId,
}: {
  schoolId: string;
}) => {
  const response = await baseFetch({
    url: `/admin/schools/${schoolId}`,
    method: "DELETE",
  });
  return response.data;
};

export const putOrgMutation = async ({
  organizationId,
  name,
}: {
  organizationId: string;
  name?: string;
}) => {
  const response = await baseFetch({
    url: `/admin/organizations/${organizationId}`,
    method: "PUT",
    body: { name },
  });
  return response.data;
};

export const putSchoolMutation = async ({
  schoolId,
  name,
}: {
  schoolId: string;
  name?: string;
}) => {
  const response = await baseFetch({
    url: `/admin/schools/${schoolId}`,
    method: "PUT",
    body: { name },
  });
  return response.data;
};

export const putRoomMutation = async ({
  roomId,
  name,
}: {
  roomId: string;
  name?: string;
}) => {
  const response = await baseFetch({
    url: `/admin/rooms/${roomId}`,
    method: "PUT",
    body: { name },
  });
  return response.data;
};
