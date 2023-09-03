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
import { GET_INVITE_BY_ID, getInviteByIdQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";

const Feedback = () => {
  const toast = useToast();
  const auth = useAuth();
  const router = useRouter();
  const inviteId = router.query.inviteId as string;

  // const { data: inviteData, isLoading: inviteLoading } = useQuery(
  //   [GET_INVITE_BY_ID, inviteId],
  //   () => getInviteByIdQuery(inviteId),
  //   {
  //     enabled: !!inviteId,
  //   }
  // );

  // const showForm = inviteData?.id === inviteId && !inviteData?.deletedAt;

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
            Feedback
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: "1rem",
              fontWeight: 400,
              marginBottom: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            Thank you for providing any feedback you can. We love to hear from
            our users and will do our best to address any concerns you may have.
          </Text>
          {/* TODO: Form with email, feedback, and submit button */}
        </Flex>
      </main>
    </>
  );
};

Feedback.displayName = "Feedback";

export default Feedback;
