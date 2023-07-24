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
import { verifyEmailMutation } from "@judie/data/mutations";
import { useEffect } from "react";

const VerifyEmail = () => {
  const toast = useToast();
  const router = useRouter();
  const userId = router.query.userId as string;

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => verifyEmailMutation(userId),
    onSuccess: () => {
      toast({
        title: "Email verified.",
        description: "You can now log in.",
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
  const formBgColor = useColorModeValue("white", "#2a3448");
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
          <Text
            style={{
              alignSelf: "center",
              fontSize: "2rem",
              fontWeight: "semibold",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            Welcome to Judie
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: "1.2rem",
              marginBottom: "2rem",
              marginTop: "0.5rem",
            }}
          >
            {}
          </Text>
          <Flex
            style={{
              width: formWidth,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: formBgColor,
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
                <Text
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                  }}
                >
                  Thanks for verifying your email!
                </Text>
                <Text
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: 400,
                  }}
                >
                  Click{" "}
                  <Link color="teal.500" href="/signin">
                    here
                  </Link>{" "}
                  if you&apos;d like to log in to Judie.
                </Text>

                <Link />
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
