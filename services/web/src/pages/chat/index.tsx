import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import Chat from "@judie/components/Chat/Chat";
import ChatNavbar from "@judie/components/ChatNavbar/ChatNavbar";
import ChatFooter from "@judie/components/ChatFooter/ChatFooter";
import { ChatProvider } from "@judie/hooks/useChat";

interface ChatPageProps {
  query?: string;
}
export default function ChatPage({ query }: ChatPageProps) {
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
        <ChatProvider>
          <SidebarPageContainer scroll={false}>
            <ChatNavbar />
            <Chat initialQuery={query} />
            <ChatFooter />
          </SidebarPageContainer>
        </ChatProvider>
      </main>
    </>
  );
}
