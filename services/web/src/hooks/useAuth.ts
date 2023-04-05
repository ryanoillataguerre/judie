import { SESSION_COOKIE } from "@judie/data/baseFetch";
import { GET_ME, getMeQuery } from "@judie/data/queries";
import { User } from "@judie/data/types/api";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const redirToChatFrom = ["/signin", "/signup"];
const DO_NOT_REDIRECT_PATHS = [...redirToChatFrom, "/"];

export default function useAuth({
  allowUnauth = false,
}: {
  allowUnauth?: boolean;
} = {}): { userData: User | undefined; isLoading: boolean } {
  const router = useRouter();
  const [sessionCookie, setSessionCookie] = useState(getCookie(SESSION_COOKIE));
  // GET /users/me

  const {
    data: userData,
    isError,
    refetch,
    error,
    isLoading,
    isFetched,
  } = useQuery(GET_ME, () => getMeQuery(), {
    enabled: !!sessionCookie,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    setTimeout(() => setSessionCookie(getCookie(SESSION_COOKIE)), 1000);
  }, []);

  // If cookies do not exist, redirect to signin
  useEffect(() => {
    if (!sessionCookie) {
      if (
        !allowUnauth &&
        !userData &&
        !isLoading &&
        isError &&
        !DO_NOT_REDIRECT_PATHS.includes(router.asPath)
      ) {
        router.push("/signin");
      }
    } else {
      refetch();
    }
  }, [
    sessionCookie,
    allowUnauth,
    isError,
    isLoading,
    refetch,
    router,
    userData,
  ]);

  useEffect(() => {
    if (!userData && !isLoading && isError && isFetched && !allowUnauth) {
      deleteCookie(SESSION_COOKIE);
      router.push("/signin");
    }
  }, [userData, isError, isLoading, isFetched, router, allowUnauth]);

  useEffect(() => {
    // Redirect away from sign in and sign up pages if logged in
    if (sessionCookie) {
      if (redirToChatFrom.includes(router.asPath)) {
        refetch();
        router.push("/chat");
      }
    } else {
      refetch();
    }
  }, [router.asPath, sessionCookie, refetch, router]);

  return { userData, isLoading };
}
