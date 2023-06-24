import { GetServerSidePropsContext } from "next";

export const serverRedirect = async (
  ctx: GetServerSidePropsContext,
  path: string
) => {
  ctx.res.setHeader("Location", path);
  ctx.res.statusCode = 301;

  return { props: {} };
};
