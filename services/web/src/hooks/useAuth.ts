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
  SubscriptionType,
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

const DO_NOT_REDIRECT_PATHS = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/parental-consent",
  "/verify",
  "/invite",
];
export const SEEN_CHATS_NOTICE_COOKIE = "judie_scn";

export const isPermissionTypeAdmin = (type: PermissionType) => {
  return (
    type === PermissionType.ORG_ADMIN ||
    type === PermissionType.SCHOOL_ADMIN ||
    type === PermissionType.ROOM_ADMIN
  );
};

export interface AuthData {
  userData: User | undefined;
  isLoading: boolean;
  isPaid: boolean;
  isB2B: boolean;
  logout: () => void;
  isAdmin: boolean;
  entities?: EntitiesResponse;
  refreshEntities: () => void;
  refresh: () => void;
}

export default function useAuth({
  allowUnauth = false,
}: {
  allowUnauth?: boolean;
} = {}): AuthData {
  const router = useRouter();
  const toast = useToast();
  const [sessionCookie, setSessionCookie] = useState(getCookie(SESSION_COOKIE));

  const isOnUnauthedRoute = useMemo(() => {
    return (
      allowUnauth ||
      DO_NOT_REDIRECT_PATHS.some((path) => router.asPath?.includes(path))
    );
  }, [allowUnauth, router]);

  const [userData, setUserData] = useState<User | undefined>(undefined);

  const isB2B = useMemo(() => {
    return !!userData?.subscription?.organizationId;
  }, [userData]);

  const isPaid = useMemo(() => {
    return (
      (userData?.subscription?.status as SubscriptionStatus) ===
      SubscriptionStatus.ACTIVE
    );
  }, [userData]);
  useEffect(() => {
    if (isProduction()) {
      window?.analytics?.identify(userData?.id ?? undefined);
    }
  }, [userData]);

  const { reset } = useContext(ChatContext);

  const logout = useCallback(() => {
    reset();
    deleteCookie(SESSION_COOKIE, {
      domain: isLocal()
        ? undefined
        : isSandbox()
        ? "sandbox.judie.io"
        : ".judie.io",
    });
    setSessionCookie(undefined);
    setUserData(undefined);
    router.push("/signin");
  }, [setUserData, setSessionCookie, reset]);

  // GET /users/me
  const { isError, refetch, isLoading, isFetched } = useQuery(
    [GET_ME, sessionCookie],
    () =>
      getMeQuery({
        isAdmin,
      }),
    {
      staleTime: 1000 * 60,
      onSuccess: (data) => {
        setUserData(data);
      },
      onError: (err: HTTPResponseError) => {
        if (err?.response?.code === 401) {
          logout();
        }
      },
      refetchOnWindowFocus: true,
      enabled: !isOnUnauthedRoute,
    }
  );

  const isAdmin = useMemo(() => {
    return (
      !!userData?.permissions?.find((permission) =>
        isPermissionTypeAdmin(permission.type)
      ) ||
      userData?.role === UserRole.JUDIE ||
      false
    );
  }, [userData]);

  const {
    data: entitiesData,
    isLoading: entitiesLoading,
    refetch: refreshEntities,
  } = useQuery({
    queryKey: [GET_USER_ENTITIES, userData?.id],
    queryFn: getUserEntitiesQuery,
    enabled: !!isAdmin,
    retry(failureCount, error) {
      if (failureCount > 2) {
        return false;
      }
      return true;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (
      isError &&
      !allowUnauth &&
      !DO_NOT_REDIRECT_PATHS.includes(router.asPath)
    ) {
      router.push("/signin", {
        query: router.query,
      });
    }
  }, [router, isError, allowUnauth]);

  // Stripe callback url has paid=true query param
  useEffect(() => {
    if (router.query.paid === "true") {
      refetch();
      toast({
        title: "Welcome to Judie Premium!",
        description: "Enjoy the unlimited access.",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
      const newQuery = router.query;
      delete newQuery.paid;
      router.push({
        pathname: router.pathname,
        query: newQuery,
      });
    }
  }, [router.query, refetch, toast, router]);

  // If cookies do not exist, redirect to signin
  useEffect(() => {
    if (!sessionCookie) {
      if (
        !allowUnauth &&
        !isLoading &&
        isError &&
        !DO_NOT_REDIRECT_PATHS.includes(router.asPath)
      ) {
        router.push("/signin");
      }
    } else {
      refetch();
    }
  }, [sessionCookie, allowUnauth, isError, isLoading, refetch, router]);

  return {
    userData,
    isPaid,
    isB2B,
    isLoading: isLoading || entitiesLoading,
    refresh: refetch,
    logout,
    isAdmin,
    entities: entitiesData,
    refreshEntities,
  };
}
