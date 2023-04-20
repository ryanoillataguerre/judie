import { GetServerSidePropsContext } from "next";
import styles from "../styles/Chat.module.scss";
import Head from "next/head";
import Navbar from "@judie/components/Navbar/Navbar";
import Sidebar from "@judie/components/Sidebar/Sidebar";
import useAuth, { SEEN_CHATS_NOTICE_COOKIE } from "@judie/hooks/useAuth";
import Chats from "@judie/components/Chats/Chats";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
interface ChatPageProps {
  query?: string;
}
export default function ChatsPage({ query }: ChatPageProps) {
  useAuth();
  const [hasSeenAlert, setHasSeenAlert] = useState<boolean>(true);
  useEffect(() => {
    const alertCookie = getCookie(SEEN_CHATS_NOTICE_COOKIE);
    if (!alertCookie) {
      setHasSeenAlert(false);
    }
  }, []);

  const onClickDismissAlert = () => {
    setHasSeenAlert(true);
    setCookie(SEEN_CHATS_NOTICE_COOKIE, "true");
  };
  return (
    <>
      <Head>
        <title>Judie - Chats</title>
        <meta
          name="description"
          content="Welcome to Judie! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.pageContentContainer}>
          <Sidebar />
          <Chats
            seenAlert={hasSeenAlert}
            onClickDismissAlert={onClickDismissAlert}
          />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const query = context.query.query;
  return {
    props: {
      query: query || null,
    },
  };
}
