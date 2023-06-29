import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import { ChatProvider } from "@judie/hooks/useChat";
import AdminSidebarPageContainer from "@judie/components/admin/AdminSidebarPageContainer/AdminSidebarPageContainer";
import AdminRoot from "@judie/components/admin/AdminRoot/AdminRoot";

// TODO Ryan
function AdminPage() {
  useAuth();
  return (
    <>
      <Head>
        <title>Judie - Admin</title>
        <meta
          name="description"
          content="Welcome to Judie Admin! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ChatProvider>
          <AdminSidebarPageContainer>
            <AdminRoot />
          </AdminSidebarPageContainer>
        </ChatProvider>
      </main>
    </>
  );
}

AdminPage.displayName = "Admin Root";

export default AdminPage;
