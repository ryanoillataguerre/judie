import { GetServerSidePropsContext } from "next";
import styles from "../styles/Chat.module.scss";
import Head from "next/head";
import Navbar from "@judie/components/Navbar/Navbar";
import Sidebar from "@judie/components/Sidebar/Sidebar";
import Chat from "@judie/components/Chat/Chat";
interface ChatPageProps {
  query?: string;
}
export default function ChatPage({ query }: ChatPageProps) {
  console.log(query);
  return (
    <>
      <Head>
        <title>Judie - Chat</title>
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
          {/* Sidebar */}
          <Sidebar />
          {/* Chat UI */}
          <Chat />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get query parameter "query" and pass in as a prop
  const query = context.query.query;
  return {
    props: {
      query: query || null,
    },
  };
}
