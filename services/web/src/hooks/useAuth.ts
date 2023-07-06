import { useToast } from "@chakra-ui/react";
import { HTTPResponseError, SESSION_COOKIE } from "@judie/data/baseFetch";
import { GET_ME, getMeQuery } from "@judie/data/queries";
import { SubscriptionStatus, User } from "@judie/data/types/api";
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

export default function useAuth({
  allowUnauth = false,
}: {
  allowUnauth?: boolean;
} = {}): AuthData {
  const router = useRouter();
  const toast = useToast();
  const [sessionCookie, setSessionCookie] = useState(getCookie(SESSION_COOKIE));

  const [userData, setUserData] = useState<User | undefined>(undefined);

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
      path: "/",
      domain: !isLocal()
        ? isSandbox()
          ? "sandbox.judie.io"
          : "judie.io"
        : undefined,
    });
    setSessionCookie(undefined);
    setUserData(undefined);
  }, [setUserData, setSessionCookie, reset]);

  // GET /users/me
  const { isError, refetch, isLoading, isFetched } = useQuery(
    [GET_ME, sessionCookie],
    () => getMeQuery(),
    {
      staleTime: 1000 * 60,
      // retryDelay(failureCount, error) {
      //   if (failureCount )
      // },
      onSuccess: (data) => {
        setUserData(data);
      },
      onError: (err: HTTPResponseError) => {
        if (err?.response?.code === 401) {
          logout();
        }
      },
      refetchOnWindowFocus: true,
    }
  );

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

  useEffect(() => {
    if (!userData && !isLoading && isError && isFetched && !allowUnauth) {
      logout();
    }
  }, [userData, isError, isLoading, isFetched, router, allowUnauth, logout]);

  return { userData, isPaid, isLoading, refresh: refetch, logout };
}

export interface AuthData {
  userData: User | undefined;
  isLoading: boolean;
  isPaid: boolean;
  logout: () => void;
  refresh: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<User, HTTPResponseError>>;
}
