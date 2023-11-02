import { useEffect } from "react";
import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import { ChatProvider } from "@judie/hooks/useChat";
import Folders from "@judie/components/Folders";

export default function ChatPage() {
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
          <SidebarPageContainer>
            <Folders />
          </SidebarPageContainer>
        </ChatProvider>
      </main>
    </>
  );
}
