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
  console.log("sessionCookie", sessionCookie);
  const [userData, setUserData] = useState<JudieUser>();
  // GET /users/me
  const { data, isError, refetch, error, isLoading } = useQuery(
    GET_ME,
    () => getMeQuery(),
    {
      staleTime: 30000,
      enabled: !!sessionCookie,
      onSuccess: (data) => {
        setUserData(data);
      },
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => setSessionCookie(getCookie(SESSION_COOKIE)));
    return () => clearTimeout(timer);
  });

  // If cookies do not exist, redirect to signin
  useEffect(() => {
    if (!sessionCookie) {
      if (!allowUnauth && !isLoading && isError) {
        router.push("/signin");
      }
    } else {
      refetch();
    }
  }, [sessionCookie]);

  // If cookies do exist, and we're getting a 401, session has expired
  // Log out and redirect to signin
  useEffect(() => {
    if (sessionCookie && isError && !isLoading) {
      // deleteCookie(SESSION_COOKIE);
      if (!allowUnauth) {
        router.push("/signin");
      }
    } else {
      refetch();
    }
  }, [sessionCookie, isError, isLoading]);

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
