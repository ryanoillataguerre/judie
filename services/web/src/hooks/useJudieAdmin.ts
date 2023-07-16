import { useToast } from "@chakra-ui/react";
import { HTTPResponseError, SESSION_COOKIE } from "@judie/data/baseFetch";
import {
  GET_ME,
  GET_USER_ENTITIES,
  getMeQuery,
  getUserEntitiesQuery,
} from "@judie/data/queries";
import {
  EntitiesResponse,
  PermissionType,
  SubscriptionStatus,
  User,
  UserRole,
} from "@judie/data/types/api";
import { isLocal, isProduction, isSandbox } from "@judie/utils/env";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo, useCallback, useContext } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";
import { ChatContext } from "./useChat";

const DO_NOT_REDIRECT_PATHS = ["/signin", "/signup"];
export const SEEN_CHATS_NOTICE_COOKIE = "judie_scn";

export const isPermissionTypeAdmin = (type: PermissionType) => {
  return (
    type === PermissionType.ORG_ADMIN ||
    type === PermissionType.SCHOOL_ADMIN ||
    type === PermissionType.ROOM_ADMIN
  );
};

export default function useJudieAuth(): AuthData {
  const [sessionCookie] = useState(getCookie(SESSION_COOKIE));

  // GET /users/me
  const { isLoading, data: userData } = useQuery(
    [GET_ME, sessionCookie],
    () =>
      getMeQuery({
        isAdmin: true,
      }),
    {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: true,
      enabled: !!sessionCookie,
    }
  );

  const isJudieAdmin = userData?.role === UserRole.JUDIE || false;

  return {
    loading: isLoading,
    isJudieAdmin,
  };
}

export interface AuthData {
  isJudieAdmin: boolean;
  loading: boolean;
}
