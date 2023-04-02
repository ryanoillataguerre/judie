import Head from "next/head";
import styles from "@judie/styles/Home.module.scss";
import { ButtonVariant } from "@judie/components/Button/Button";
import { HomepageStyle } from "@judie/components/lottie/HomepageBackground/HomepageBackground";
import { FormEventHandler, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { GetStaticPropsContext } from "next";
import useAuth from "@judie/hooks/useAuth";

const DynamicBackground = dynamic(
  () =>
    import("@judie/components/lottie/HomepageBackground/HomepageBackground"),
  {
    ssr: false,
  }
);
const DynamicNavbar = dynamic(() => import("@judie/components/Navbar/Navbar"), {
  ssr: false,
});
const DynamicChatBox = dynamic(
  () => import("@judie/components/ChatBox/ChatBox"),
  {
    ssr: false,
  }
);
const DynamicButton = dynamic(() => import("@judie/components/Button/Button"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const { userData } = useAuth({ allowUnauth: true });
  const [query, setQuery] = useState<string>("");
  const [styleMode, setStyleMode] = useState<HomepageStyle>(
    HomepageStyle.Default
  );
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (userData) {
      const url = `/chat?query=${query}`;
      if (router?.isReady) {
        router?.push(url);
      }
    } else {
      const url = `/signup?query=${query}`;
      if (router?.isReady) {
        router?.push(url);
      }
    }
  };

  useEffect(() => {
    // Randomly pick between two background animations
    // TODO: This leads to a flash of the default background, we should fix this
    const random = Math.random();
    if (random > 0.5) {
      setStyleMode(HomepageStyle.Blue);
    } else {
      setStyleMode(HomepageStyle.Default);
    }
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
        <Suspense fallback={<div />}>
          <DynamicBackground mode={styleMode} />
        </Suspense>
        <Suspense fallback={<div />}>
          <DynamicNavbar />
        </Suspense>
        <div className={styles.pageContentContainer}>
          <div className={styles.contentContainer}>
            {/* Title */}
            <h1
              className={
                styleMode === HomepageStyle.Blue
                  ? [styles.title, styles.white].join(" ")
                  : styles.title
              }
            >
              Welcome to Judie!
            </h1>
            {/* Subtitle */}
            <h2
              className={
                styleMode === HomepageStyle.Blue
                  ? [styles.subtitle, styles.white].join(" ")
                  : styles.subtitle
              }
            >
              Any subject, any question, any time.
            </h2>
            {/* Chat Box */}
            <form className={styles.formContainer} onSubmit={onSubmit}>
              <Suspense fallback={<div />}>
                <DynamicChatBox onChange={(e) => setQuery(e.target.value)} />
              </Suspense>
              <div className={styles.buttonContainer}>
                <Suspense fallback={<div />}>
                  <DynamicButton
                    className={styles.submitButton}
                    label="Start Learning"
                    variant={
                      styleMode === HomepageStyle.Blue
                        ? ButtonVariant.Blue
                        : ButtonVariant.Default
                    }
                  />
                </Suspense>
              </div>
            </form>
            {/* Extra Info */}
            <p
              className={
                styleMode === HomepageStyle.Blue
                  ? [styles.details, styles.white].join(" ")
                  : styles.details
              }
            >
              Judie is built specifically to focus on the needs of students; we
              use the socratic method to prompt users to the answer, not feed it
              to you like bare ChatGPT, which we have found leads to a deeper
              learning experience.
            </p>
            {/* Read More */}
            <a
              className={
                styleMode === HomepageStyle.Blue
                  ? [styles.detailsLink, styles.white].join(" ")
                  : styles.detailsLink
              }
              href={"/about"}
            >
              Read More about how Judie helps you learn
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {},
  };
}
