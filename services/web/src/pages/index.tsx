import Head from "next/head";
import styles from "@judie/styles/Home.module.scss";
<<<<<<< HEAD
import { ButtonVariant } from "@judie/components/Button/Button";
import { FormEventHandler, useEffect, useState } from "react";
=======
import { useEffect } from "react";
>>>>>>> 1b40c84f85af22a73e9893b6c09bab9ace358941
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { serverRedirect } from "@judie/utils/middleware/redirectToWaitlist";
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
<<<<<<< HEAD
  }, []);
=======
  }, [router]);
>>>>>>> 1b40c84f85af22a73e9893b6c09bab9ace358941

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
<<<<<<< HEAD
        <DynamicNavbar />
        <div className={styles.pageContentContainer}>
          <div className={styles.contentContainer}>
            {/* Title */}
            <h1 className={styles.title}>Welcome to Judie!</h1>
            {/* Subtitle */}
            <h2 className={styles.subtitle}>
              Any subject, any question, any time.
            </h2>
            {/* Chat Box
            <form className={styles.formContainer} onSubmit={onSubmit}>
              <DynamicChatBox onChange={(e) => setQuery(e.target.value)} />
              <div className={styles.buttonContainer}>
                <DynamicButton
                  className={styles.submitButton}
                  label="Start Learning"
                  variant={ButtonVariant.Default}
                />
              </div>
            </form> */}
            {/* Extra Info */}
            <p className={styles.details}>
              Judie is built specifically to focus on the needs of students; we
              use the socratic method to prompt users to the answer, not feed it
              to you like bare ChatGPT, which we have found leads to a deeper
              learning experience.
            </p>
            {/* Read More */}
            <a className={styles.detailsLink} href={"/about"}>
              Read More about how Judie helps you learn
            </a>
          </div>
        </div>
=======
        <LoadingScreen />
>>>>>>> 1b40c84f85af22a73e9893b6c09bab9ace358941
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
