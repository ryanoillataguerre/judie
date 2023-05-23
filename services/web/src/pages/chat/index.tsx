import { GetServerSidePropsContext } from "next";
import styles from "../../styles/Chat.module.scss";
import Head from "next/head";
import Sidebar from "@judie/components/Sidebar/Sidebar";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";
import { serverRedirect } from "@judie/utils/middleware/redirectToWaitlist";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";

interface ChatPageProps {
  query?: string;
}
export default function ChatPage({ query }: ChatPageProps) {
  const router = useRouter();
  useAuth();

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
      <main>
        <SidebarPageContainer>
          {/* <Chat chatId={router.query.chatId as string} initialQuery={query} /> */}
        </SidebarPageContainer>
      </main>
    </>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // Get query parameter "query" and pass in as a prop
//   const query = context.query.query;
//   return {
//     props: {
//       query: query || null,
//     },
//   };
// }
