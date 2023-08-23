import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  Divider,
  InputLeftElement,
  InputGroup,
  VStack,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

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
            boxShadow={"lg"}
            style={{
              height: "100%",
              width: "100%",
              padding: "20px 30px",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              borderRadius: "22px",
            }}
          >
            <Flex py={30} w="100%">
              <VStack spacing={"5px"} alignItems={"flex-start"}>
                <Heading as="h1" fontSize={"24px"}>
                  Settings
                </Heading>
                <Text>Manage your account</Text>
              </VStack>
              <Spacer />
              <Flex flexGrow={1} maxW={502} alignItems={"center"}>
                <InputGroup>
                  <InputLeftElement
                    py={15}
                    h={54}
                    pl={4}
                    pointerEvents="none"
                    children={<Search2Icon color="gray.300" />}
                  />
                  <Input
                    borderRadius={"100px"}
                    py={15}
                    pl={45}
                    h={54}
                    type="text"
                    placeholder="Search"
                  />
                </InputGroup>
              </Flex>
            </Flex>
            <Divider />
            <Flex
              w="100%"
              p={15}
              bg="brand.primary"
              color={"white"}
              borderRadius={11}
              h={104}
            >
              <Flex alignItems={"center"}>
                <Avatar mr={"10px"} borderRadius="full" boxSize="74px" src="" />
                <Flex flexDirection={"column"}>
                  <Text>Username</Text>
                  <Text>email</Text>
                </Flex>
              </Flex>
              <Spacer />
              <Button alignSelf={"center"} variant="solid" colorScheme="blue">
                Log out
              </Button>
            </Flex>
            <Box>
              <form action="">
                <FormLabel>Text</FormLabel>
                <Input></Input>
              </form>
            </Box>
            {/* <Text fontWeight="bold" fontSize={"2rem"} marginBottom={"1rem"}>
              Manage Billing
            </Text>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => getBillingPortal.refetch()}
            >
              Manage
            </Button> */}
          </Flex>
        </SidebarPageContainer>
      </main>
    </>
  );
};

SettingsPage.displayName = "Settings";

export default SettingsPage;
