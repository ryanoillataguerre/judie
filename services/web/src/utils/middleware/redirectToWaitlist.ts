import { GetServerSidePropsContext } from "next";

export const serverRedirect = (
  ctx: GetServerSidePropsContext,
  path: string
) => {
  const { referer } = ctx.req.headers; // if there's no referer then it was a server request

  if (!referer) {
    ctx.res.setHeader("Location", path);
    ctx.res.statusCode = 301;
  }

  return { props: {} };
};
