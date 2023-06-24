import Head from "next/head";
import styles from "@judie/styles/Home.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { removeCookie, serverRedirect, verifyAuth } from "@judie/utils/middleware/server";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
const Home = () => {
  // const { userData } = useAuth({ allowUnauth: true });
  // const [query, setQuery] = useState<string>("");
  // const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   if (userData) {
  //     const url = `/chat?query=${query}`;
  //     if (router?.isReady) {
  //       router?.push(url);
  //     }
  //   } else {
  //     const url = `/signup?query=${query}`;
  //     if (router?.isReady) {
  //       router?.push(url);
  //     }
  //   }
  // };
  // Redirect to signin
  const router = useRouter();
  useEffect(() => {
    router.push("/signin", {
      query: router.query,
    });
  }, [router]);

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
    const isAuthed = await verifyAuth(ctx.req.cookies.judie_sid);
    if (isAuthed) {
      return serverRedirect(ctx, "/chat");
    } else {
      ctx.res.setHeader('Set-Cookie', 'judie_sid=bad; Max-Age=0');
      return serverRedirect(ctx, "/signin");
    }
  }
};

export default Home;
