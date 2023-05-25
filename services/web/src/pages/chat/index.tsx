import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import Chat from "@judie/components/Chat/Chat";
import { ChatContext } from "@judie/data/contexts/ChatContext";
import ChatNavbar from "@judie/components/ChatNavbar/ChatNavbar";

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
          <ChatNavbar />
          <Chat
            chatId={router.query.id as string | undefined}
            initialQuery={query}
          />
        </SidebarPageContainer>
      </main>
    </>
  );
}
