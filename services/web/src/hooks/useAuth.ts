import { HTTPResponseError, SESSION_COOKIE } from "@judie/data/baseFetch";
import { GET_ME, getMeQuery } from "@judie/data/queries";
import { User } from "@judie/data/types/api";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "react-query";

const redirToChatFrom = ["/signin", "/signup"];
const DO_NOT_REDIRECT_PATHS = [...redirToChatFrom, "/"];
export const SEEN_CHATS_NOTICE_COOKIE = "judie_scn";

export default function useAuth({
  allowUnauth = false,
}: {
  allowUnauth?: boolean;
} = {}): { userData: User | undefined; isLoading: boolean } {
  const router = useRouter();
  const [sessionCookie, setSessionCookie] = useState(getCookie(SESSION_COOKIE));

  const [userData, setUserData] = useState<User | undefined>(undefined);

  const logout = useCallback(() => {
    deleteCookie(SESSION_COOKIE);
    setSessionCookie(undefined);
    setUserData(undefined);
    router.push("/signin");
  }, [router]);

  // GET /users/me
  const { isError, refetch, error, isLoading, isFetched } = useQuery(
    GET_ME,
    () => getMeQuery(),
    {
      enabled: !!sessionCookie,
      staleTime: 1000 * 60,
      onSuccess: (data) => {
        setUserData(data);
      },
      onError: (err: HTTPResponseError) => {
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

  useEffect(() => {
    // Redirect away from sign in and sign up pages if logged in
    if (redirToChatFrom.includes(router.asPath) && sessionCookie) {
      refetch();
      router.push("/chat");
    }
  }, [sessionCookie, refetch, router]);

  return { userData, isLoading };
}

export interface AuthData {
  userData: User | undefined;
  isLoading: boolean;
}
