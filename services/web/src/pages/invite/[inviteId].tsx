import Head from "next/head";
import ReactPlayer from "react-player/youtube";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { redeemInviteMutation, waitlistMutation } from "@judie/data/mutations";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { AiFillCheckCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import { SignupForm, SignupSubmitData } from "../signup";
import { GET_INVITE_BY_ID, getInviteByIdQuery } from "@judie/data/queries";

const RedeemInvite = () => {
  const toast = useToast();
  const router = useRouter();
  const inviteId = router.query.inviteId as string;

  const { data: inviteData } = useQuery(
    [GET_INVITE_BY_ID, inviteId],
    () => getInviteByIdQuery(inviteId),
    {
      enabled: !!inviteId,
    }
  );

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: redeemInviteMutation,
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Welcome to Judie",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        router.push("/chat");
      }, 1000);
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error redeeming", err);
      toast({
        title: "Error redeeming invite",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<SignupSubmitData> = async (
    params: SignupSubmitData
  ) => {
    try {
      if (!inviteId) {
        toast({
          title: "Error redeeming invite",
          description: "No invite id",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      await mutateAsync({
        ...params,
        inviteId,
      });
    } catch (err) {
      console.error("Error redeeming invite", err);
    }
  };

  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
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
              marginBottom: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            We're so excited to have you here!
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

          <SignupForm
            inviteEmail={inviteData?.email}
            inviteFirstName={inviteData?.firstName}
            inviteLastName={inviteData?.lastName}
            inviteId={inviteId}
          />
        </Flex>
      </main>
    </>
  );
};

RedeemInvite.displayName = "Redeem Invite";

export default RedeemInvite;
