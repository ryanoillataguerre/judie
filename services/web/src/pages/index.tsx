import Head from "next/head";
import styles from "@judie/styles/Home.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { serverRedirect } from "@judie/utils/middleware/redirectToWaitlist";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/signin", {
      query: router.query,
    });
  }, []);

  return (
    <>
      <Head>
        <title>Judie</title>
        <meta
          name="description"
          content="Judie is an advanced tutor chat that runs on OpenAI's ChatGPT"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <LoadingScreen />
      </main>
    </>
  );
};
Home.displayName = "Home";

// Redirect users to signin if unauthed, otherwise redirect to chat
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (ctx.req.cookies.judie_sid) {
    return serverRedirect(ctx, "/chat");
  }
  return serverRedirect(ctx, "/signin");
};

export default Home;
