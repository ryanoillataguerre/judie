import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import {
  GET_PORTAL_LINK,
  getBillingPortalLinkQuery,
} from "@judie/data/queries";
import Head from "next/head";
import { useQuery } from "react-query";

const SettingsPage = () => {
  const getBillingPortal = useQuery(GET_PORTAL_LINK, {
    queryFn: getBillingPortalLinkQuery,
    enabled: false,
    onSuccess: (data) => {
      window.open(data, "_blank");
    },
  });
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
          <Flex
            style={{
              height: "100%",
              width: "100%",
              padding: "2rem",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Text fontWeight="bold" fontSize={"2rem"} marginBottom={"1rem"}>
              Manage Billing
            </Text>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => getBillingPortal.refetch()}
            >
              Manage
            </Button>
          </Flex>
        </SidebarPageContainer>
      </main>
    </>
  );
};

SettingsPage.displayName = "Settings";

export default SettingsPage;
