import { HTTPResponseError, SESSION_COOKIE } from "@judie/data/baseFetch";
import { GET_ME, getMeQuery } from "@judie/data/queries";
import { SubscriptionStatus, User } from "@judie/data/types/api";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";

const redirToChatFrom = ["/signin", "/signup"];
const DO_NOT_REDIRECT_PATHS = [...redirToChatFrom, "/"];
export const SEEN_CHATS_NOTICE_COOKIE = "judie_scn";

export default function useAuth({
  allowUnauth = false,
}: {
  allowUnauth?: boolean;
} = {}): AuthData {
  const router = useRouter();
  const [sessionCookie, setSessionCookie] = useState(getCookie(SESSION_COOKIE));

  const [userData, setUserData] = useState<User | undefined>(undefined);

  const isPaid = useMemo(() => {
    return (
      (userData?.subscription?.status as SubscriptionStatus) ===
      SubscriptionStatus.ACTIVE
    );
  }, [userData]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      window?.analytics?.identify(userData?.id ?? undefined);
    }
  }, [userData]);

  const logout = () => {
    deleteCookie(SESSION_COOKIE, {
      path: "/",
      domain:
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "judie.io"
          : undefined,
    });
    setSessionCookie(undefined);
    setUserData(undefined);
    router.push("/signin");
  };

  // GET /users/me
  const { isError, refetch, error, isLoading, isFetched } = useQuery(
    [GET_ME],
    () => getMeQuery(),
    {
      enabled: !!sessionCookie,
      staleTime: 1000 * 60,
      onSuccess: (data) => {
        setUserData(data);
      },
      onError: (err: HTTPResponseError) => {
        console.error("/me error", err);
        setUserData(undefined);
        if (err.response?.status === 401) {
          logout();
        }
      },
    }
  );

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

  // useEffect(() => {
  //   // Redirect away from sign in and sign up pages if logged in
  //   if (redirToChatFrom.includes(router.asPath) && userData) {
  //     refetch();
  //     router.push("/chat");
  //   }
  // }, [userData, refetch, router]);

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
