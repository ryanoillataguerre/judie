import Head from "next/head";
import ReactPlayer from "react-player/youtube";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { waitlistMutation } from "@judie/data/mutations";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { AiFillCheckCircle } from "react-icons/ai";

const WaitlistPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const { handleSubmit, register } = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: waitlistMutation,
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error waitlisting", err);
      toast({
        title: "Error waitlisting",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<{ email: string }> = async ({
    email,
  }: {
    email: string;
  }) => {
    try {
      await mutateAsync({
        email,
      });
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {}
  };

  const buttonVal = useMemo(() => {
    if (isLoading) {
      return <Spinner />;
    }
    if (submitted) {
      return <AiFillCheckCircle size={24} fill={"#FFFFFF"} />;
    }
    return "Submit";
  }, [isLoading, submitted]);

  const containerWidth = useBreakpointValue({ base: "100%", md: "50%" });
  const backgroundSrc = useColorModeValue("/logo.svg", "/logo_dark.svg");
  return (
    <>
      <Head>
        <title>Judie - Waitlist</title>
        <meta
          name="description"
          content="Welcome to Judie! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            padding: "1rem 1rem 3rem 1rem",
          }}
        >
          <Image
            src={backgroundSrc}
            alt={"Judie Logo"}
            style={{
              width: "5rem",
              height: "5rem",
              marginBottom: "1rem",
            }}
          />
          <Box
            style={{
              width: containerWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
              }}
              marginY={"1rem"}
            >
              Thanks for your interest in Judie!
            </Text>
            <Text marginY={"1rem"}>We&apos;re currently in closed beta.</Text>
            <Text marginY={"1rem"}>
              Please enter your email below and join our waitlist. We&apos;ll
              reach out soon with an invite!
            </Text>
          </Box>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: containerWidth,
            }}
          >
            <Input
              placeholder={"judie@judie.io"}
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              {...register("email", { required: true })}
            />
            <Button
              type="submit"
              variant={"solid"}
              style={{
                marginTop: "1rem",
                marginBottom: "1rem",
                width: "100%",
              }}
              colorScheme="teal"
            >
              {buttonVal}
            </Button>
          </form>
          <Text fontSize={"1rem"} fontWeight={600} marginY={"1rem"}>
            In the meantime, check out a demo of Judie below:
          </Text>
          <ReactPlayer
            style={{
              maxWidth: "90%",
              aspectRatio: "16/9",
            }}
            url={"https://www.youtube.com/watch?v=mNLcoqCwR9o"}
          />
        </Box>
      </main>
    </>
  );
};

WaitlistPage.displayName = "Waitlist";

export default WaitlistPage;
