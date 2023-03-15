import Head from "next/head";
import styles from "@judie/styles/Home.module.scss";
import Navbar from "@judie/components/Navbar/Navbar";
import ChatBox from "@judie/components/ChatBox/ChatBox";
import Button from "@judie/components/Button/Button";
import HomepageBackground from "@judie/components/lottie/HomepageBackground/HomepageBackground";
import { GetStaticPropsContext } from "next";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const url = `/chat?query=${query}`;
    router.push(url);
  };
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
        <HomepageBackground />
        <Navbar />
        <div className={styles.pageContentContainer}>
          <div className={styles.contentContainer}>
            {/* Title */}
            <h1 className={styles.title}>Welcome to Judie!</h1>
            {/* Subtitle */}
            <h2 className={styles.subtitle}>
              Any subject, any question, any time.
            </h2>
            {/* Chat Box */}
            <form className={styles.formContainer} onSubmit={onSubmit}>
              <ChatBox onChange={(e) => setQuery(e.target.value)} />
              <div className={styles.buttonContainer}>
                <Button
                  className={styles.submitButton}
                  label="Start Learning"
                />
              </div>
            </form>
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
      </main>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {},
  };
}
