import { HTTPResponseError } from "@judie/data/baseFetch";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useMutation } from "react-query";
import { forgotPasswordMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "@judie/components/Button/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Link,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import { removeCookie, serverRedirect, verifyAuth } from "@judie/utils/middleware/server";

interface SubmitData {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  const toast = useToast();
  const [success, setSuccess] = useState(false);
  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
      email: "",
    },
    reValidateMode: "onBlur",
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: forgotPasswordMutation,
    onSuccess: () => {
        setSuccess(true);
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error sending forgot password email in", err);
      toast({
        title: "Error sending forgot password",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });


  const onSubmit: SubmitHandler<SubmitData> = async ({
    email,
  }: SubmitData) => {
    try {
      await mutateAsync({
        email,
      });
    } catch (err) {}
  };

  // Styles
  const formWidth = useBreakpointValue({
    base: "100%",
    md: "60%",
    lg: "40%",
  });
  const formBgColor = useColorModeValue("white", "#2a3448");

  return (
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
          <Text
            style={{
              fontSize: "1rem",
            }}
          >
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type={"email"}
              autoComplete="email"
              required
              placeholder="judie@judie.io"
              {...register("email", {})}
            />
          </FormControl>
        </Flex>
        <Flex
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Text
            style={{
              fontSize: "0.8rem",
            }}
          >
            Remembered it?
          </Text>
          <Link
            color="teal"
            style={{
              fontSize: "1rem",
            }}
            onClick={() => {
              router.push({
                pathname: "/signin",
                query: router.query,
              });
            }}
          >
            Sign In
          </Link>
        </Flex>
        <Button
          style={{
            width: "100%",
          }}
          colorScheme={success ? "green" : "blue"}
          variant={"solid"}
          loading={isLoading}
          label={success ? "Email Sent!" : "Send Email"}
          type="submit"
        />
      </form>
    </Flex>
  );
};

const ForgotPassword = () => {
  useAuth({ allowUnauth: true });
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
  return (
    <>
      <Head>
        <title>Judie - Forgot Password</title>
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
              marginBottom: "3rem",
              marginTop: "3rem",
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
            Forgot your password?
          </Text>
          <ForgotPasswordForm />
        </Flex>
      </main>
    </>
  );
};

// Redirect users to chat if authed
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (ctx.req.cookies.judie_sid) {
    const isAuthed = await verifyAuth(ctx.req.cookies.judie_sid);
    if (isAuthed) {
      return serverRedirect(ctx, "/chat");
    } else {
      removeCookie(ctx);
    }
  }
  return { props: {} };
};

ForgotPassword.displayName = "Forgot Password";

export default ForgotPassword;
