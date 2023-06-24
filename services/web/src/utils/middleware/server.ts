import { baseFetch } from "@judie/data/baseFetch";
import { GetServerSidePropsContext } from "next";

export const serverRedirect = (
  ctx: GetServerSidePropsContext,
  path: string
) => {
  ctx.res.setHeader("Location", path);
  ctx.res.statusCode = 301;

  return { props: {} };
};

export const verifyAuth = async (cookie?: string) => {
  if (!cookie) {
    return false;
  }
  // Get /user/me to verify auth
  try {
    await baseFetch({
      url: "/user/me",
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });
    console.log('all good')
    return true;
  } catch (err) {
    console.log('errored', err)
    return false;
  }
}

export const removeCookie = (ctx: GetServerSidePropsContext) => {
  ctx.res.setHeader('Set-Cookie', 'judie_sid=bad; Max-Age=0');
}