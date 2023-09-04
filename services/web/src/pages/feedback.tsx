import Head from "next/head";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import { GET_INVITE_BY_ID, getInviteByIdQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { feedbackMutation } from "@judie/data/mutations";
import { HTTPResponseError } from "@judie/data/baseFetch";

export interface FeedbackSubmitData {
  email?: string;
  feedback: string;
}

const Feedback = () => {
  const toast = useToast();
  const auth = useAuth({ allowUnauth: true });

  const isAuthed = !!auth.userData?.id;
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

  const { handleSubmit, register } = useForm<FeedbackSubmitData>({
    defaultValues: {
      email: "",
      feedback: "",
    },
    reValidateMode: "onBlur",
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: feedbackMutation,
    onSuccess: () => {
      toast({
        title: "Success!",
        description:
          "Your feedback has been submitted. Thank you for taking the time!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(isAuthed ? "/dashboard" : "/");
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error submitting feedback", err);
      toast({
        title: "Error submitting feedback",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<FeedbackSubmitData> = async ({
    email,
    feedback,
  }: FeedbackSubmitData) => {
    return await mutateAsync({
      email,
      feedback,
    });
  };
  return (
    <>
      <Head>
        <title>Judie - Feedback</title>
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
              width: "50%",
            }}
          >
            Thank you for providing any feedback you can. We love to hear from
            our users and will do our best to address any concerns you may have.
          </Text>
          <Flex
            style={{
              width: formWidth,
              flexDirection: "column",
              alignItems: "flex-start",
              backgroundColor: formBgColor,
              padding: "2rem",
              borderRadius: "0.8rem",
            }}
            boxShadow={"lg"}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                width: "100%",
              }}
            >
              <Flex
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: "1rem",
                }}
              >
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired={!isAuthed}
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type={"email"}
                    autoComplete="email"
                    required
                    placeholder="judie@judie.io"
                    {...register("email", {})}
                    isReadOnly={isAuthed}
                    {...(isAuthed
                      ? {
                          value: auth.userData?.email,
                        }
                      : {})}
                    disabled={isAuthed}
                  />
                </FormControl>
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired
                >
                  <FormLabel htmlFor="feedback">Notes</FormLabel>
                  <Textarea
                    id="feedback"
                    required
                    placeholder="I wish that Judie could..."
                    {...register("feedback", {})}
                  />
                </FormControl>
              </Flex>
              <Button
                style={{
                  width: "100%",
                }}
                variant={"purp"}
                isLoading={isLoading}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Flex>
        </Flex>
      </main>
    </>
  );
};

Feedback.displayName = "Feedback";

export default Feedback;
