import { InviteSheetRole } from "@judie/components/admin/InviteModal";
import { HTTPResponseError, baseFetch } from "./baseFetch";
import { Chat, GradeYear, PermissionType, UserRole } from "./types/api";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import firebaseApp from "@judie/utils/firebase";

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
  // Firebase auth logic
  try {
    const auth = getAuth(firebaseApp);
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const response = await baseFetch({
      url: "/auth/signup",
      method: "POST",
      body: {
        uid: result.user.uid,
        receivePromotions,
        role,
        districtOrSchool,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error signing up", err);
    throw err;
  }
};

export const createChatMutation = async ({
  subject,
  folderId,
}: {
  subject?: string | undefined;
  folderId?: string | undefined;
}): Promise<Chat> => {
  const response = await baseFetch({
    url: "/chat",
    method: "POST",
    body: {
      subject: subject || undefined,
      folderId: folderId || undefined,
    },
  });
  return response.data;
};

export const putChatMutation = async ({
  chatId,
  subject,
  userTitle,
  folderId,
}: {
  chatId: string;
  subject?: string;
  userTitle?: string;
  folderId?: string;
}): Promise<Chat> => {
  const response = await baseFetch({
    url: `/chat/${chatId}`,
    method: "PUT",
    body: {
      subject,
      userTitle,
      folderId,
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
  const response = await baseFetch({
    url: `/chat/whisper/transcribe`,
    body: data,
    method: "POST",
    form: true,
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

export const deletePermissionMutation = async ({
  permissionId,
}: {
  permissionId: string;
}) => {
  const response = await baseFetch({
    url: `/admin/permissions/${permissionId}`,
    method: "DELETE",
  });
  return response.data;
};

export const createPermissionMutation = async ({
  userId,
  type,
  organizationId,
  schoolId,
  roomId,
}: {
  userId: string;
  type: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}) => {
  const response = await baseFetch({
    url: `/admin/permissions/`,
    method: "POST",
    body: { userId, type, organizationId, schoolId, roomId },
  });
  return response.data;
};

export const putPermissionMutation = async ({
  selectedUserId,
  permissionId,
  type,
  schoolId,
  organizationId,
  roomId,
}: {
  selectedUserId: string;
  permissionId: string;
  type?: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}): Promise<Chat> => {
  const response = await baseFetch({
    url: `/admin/permissions/${permissionId}`,
    method: "PUT",
    body: {
      selectedUserId,
      type,
      organizationId,
      schoolId,
      roomId,
    },
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

export const putUserMutation = async ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  const response = await baseFetch({
    url: `/user/me`,
    method: "PUT",
    body: {
      firstName,
      lastName,
    },
  });
  return response.data;
};

export const changePasswordMutation = async ({
  oldPassword,
  newPassword,
  passwordConfirm,
}: {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}) => {
  const response = await baseFetch({
    url: `/auth/change-password`,
    method: "PUT",
    body: {
      oldPassword,
      newPassword,
      passwordConfirm,
    },
  });
  return response.data;
};

export const resendInviteMutation = async ({
  inviteId,
}: {
  inviteId: string;
}) => {
  const response = await baseFetch({
    url: `/admin/invites/${inviteId}/resend`,
    method: "POST",
  });
  return response.data;
};

export const uploadAssignmentMutation = async ({
  chatId,
  data,
  setChatValue,
  onStreamEnd,
  onError,
  abortController,
}: {
  chatId: string;
  data: FormData;
  setChatValue: (chat: string) => void;
  onStreamEnd?: () => void;
  onError?: (error: HTTPResponseError) => void;
  abortController?: AbortController;
}): Promise<string> => {
  const response = await baseFetch({
    url: `/chat/${chatId}/context/pdf`,
    body: data,
    method: "POST",
    stream: true,
    onChunkReceived: setChatValue,
    onStreamEnd,
    onError,
    abortController,
    form: true,
  });
  return response;
};

export const createFolderMutation = async ({ title }: { title: string }) => {
  const response = await baseFetch({
    url: `/folders`,
    method: "POST",
    body: { title },
  });
  return response.data;
};

export const ageAndConsentMutation = async ({
  dateOfBirth,
  parentEmail,
}: {
  dateOfBirth: string;
  parentEmail?: string;
}) => {
  const response = await baseFetch({
    url: `/user/dob-consent`,
    method: "POST",
    body: { dateOfBirth, parentEmail },
  });
  return response.data;
};

export const parentalConsentMutation = async ({
  userId,
}: {
  userId: string;
}) => {
  const response = await baseFetch({
    url: `/user/${userId}/parental-consent`,
    method: "POST",
  });
  return response.data;
};

export const feedbackMutation = async ({
  email,
  feedback,
}: {
  email?: string;
  feedback: string;
}) => {
  const response = await baseFetch({
    url: `/user/feedback`,
    method: "POST",
    body: { email, feedback },
  });
  return response.data;
};
