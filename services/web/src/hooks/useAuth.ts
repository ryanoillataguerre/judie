import { SESSION_COOKIE } from "@judie/data/baseFetch";
import { GET_ME, getMeQuery } from "@judie/data/queries";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { JudieUser } from "@services/types";

const redirToChatFrom = ["/signin", "/signup"];

export default function useAuth({
  allowUnauth = false,
}: {
  allowUnauth?: boolean;
} = {}): { userData: JudieUser | undefined; isLoading: boolean } {
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
  });

  useEffect(() => {
    const timer = setTimeout(
      () => setSessionCookie(getCookie(SESSION_COOKIE)),
      1000
    );
    return () => clearTimeout(timer);
  });

  // If cookies do not exist, redirect to signin
  useEffect(() => {
    if (!sessionCookie) {
      if (!allowUnauth && !userData && !isLoading && isError) {
        router.push("/signin");
      }
    } else {
      refetch();
    }
  }, [sessionCookie]);

  useEffect(() => {
    if (!userData && !isLoading && isError && isFetched) {
      deleteCookie(SESSION_COOKIE);
      router.push("/signin");
    }
  }, [userData, isError, isLoading, isFetched]);

  useEffect(() => {
    // Redirect away from sign in and sign up pages if logged in
    if (sessionCookie) {
      if (redirToChatFrom.includes(router.asPath)) {
        router.push("/chat");
      }
    } else {
      refetch();
    }
  }, [router.asPath, sessionCookie]);

  return { userData, isLoading };
}
