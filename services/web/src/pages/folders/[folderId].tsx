import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import { ChatProvider } from "@judie/hooks/useChat";
import { useRouter } from "next/router";
import Folder from "@judie/components/Folder";

export default function ChatPage() {
  useAuth();
  const router = useRouter();
  const folderId = router.query.folderId as string;

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
            <Folder id={folderId} />
          </SidebarPageContainer>
        </ChatProvider>
      </main>
    </>
  );
}
