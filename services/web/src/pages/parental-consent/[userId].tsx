import Head from "next/head";

import {
  Flex,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { parentalConsentMutation } from "@judie/data/mutations";
import { useEffect } from "react";

const VerifyEmail = () => {
  const toast = useToast();
  const router = useRouter();
  const userId = router.query.userId as string;

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => parentalConsentMutation({ userId }),
    onSuccess: () => {
      toast({
        title: "Access approved",
        description: "Your student can now use Judie.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    if (userId) {
      (async () => {
        await mutateAsync();
      })();
    }
  }, [userId, mutateAsync]);

  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
  const formWidth = useBreakpointValue({
    base: "100%",
    md: "60%",
    lg: "40%",
  });
  return (
    <>
      <Head>
        <title>Judie - Verify Email</title>
        <meta
          name="description"
          content="Welcome to Judie! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          style={{
            height: "100%",
            width: "100%",
            padding: "1rem",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "3rem",
          }}
        >
          <Image
            src={logoPath}
            alt={"Judie Logo"}
            style={{
              height: "6rem",
              width: "6rem",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          />
          <Text variant={"header"}>Welcome to Judie</Text>
          <Flex
            style={{
              width: formWidth,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              borderRadius: "0.8rem",
            }}
            boxShadow={"lg"}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <VStack
                style={{
                  width: "100%",
                  alignItems: "flex-start",
                }}
              >
                <Text variant={"title"}>
                  Thanks for approving your student's access to Judie! They can
                  get started now.
                </Text>
              </VStack>
            )}
          </Flex>
        </Flex>
      </main>
    </>
  );
};

VerifyEmail.displayName = "Verify Email";

export default VerifyEmail;
