import Head from "next/head";

import {
  Flex,
  Image,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { SignupForm } from "../signup";
import { GET_INVITE_BY_ID, getInviteByIdQuery } from "@judie/data/queries";

const RedeemInvite = () => {
  const toast = useToast();
  const router = useRouter();
  const inviteId = router.query.inviteId as string;

  const { data: inviteData, isLoading: inviteLoading } = useQuery(
    [GET_INVITE_BY_ID, inviteId],
    () => getInviteByIdQuery(inviteId),
    {
      enabled: !!inviteId,
    }
  );

  const showForm = inviteData?.id === inviteId && !inviteData?.deletedAt;

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
        <title>Judie - Redeem Invite</title>
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
            We're so excited you're here!
          </Text>
          {inviteData && (
            <Text
              style={{
                alignSelf: "center",
                fontSize: "1rem",
                fontWeight: 400,
                marginBottom: "1.5rem",
                marginTop: "0.5rem",
              }}
            >
              Someone from{" "}
              {inviteData?.school?.name ||
                inviteData?.organization?.name ||
                "your school"}{" "}
              invited you to join Judie. Please sign up below to redeem your
              invite.
            </Text>
          )}

          {!inviteLoading && showForm ? (
            <SignupForm inviteEmail={inviteData?.email} inviteId={inviteId} />
          ) : !showForm ? (
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
              {inviteLoading ? (
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
                    We're sorry, your invite has expired.
                  </Text>
                  <Text
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: 400,
                    }}
                  >
                    Please have an administrator send you another one.
                  </Text>
                </VStack>
              )}
            </Flex>
          ) : null}
        </Flex>
      </main>
    </>
  );
};

RedeemInvite.displayName = "Redeem Invite";

export default RedeemInvite;
