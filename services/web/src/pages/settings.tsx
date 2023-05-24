import { Box } from "@chakra-ui/react";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import Head from "next/head";

const SettingsPage = () => {
  return (
    <>
      <Head>
        <title>Judie - Settings</title>
        <meta
          name="description"
          content="Welcome to Judie! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SidebarPageContainer>
          <Box></Box>
        </SidebarPageContainer>
      </main>
    </>
  );
};

SettingsPage.displayName = "Settings";

export default SettingsPage;
