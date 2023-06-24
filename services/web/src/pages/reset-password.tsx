import { HTTPResponseError } from "@judie/data/baseFetch";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useMutation } from "react-query";
import { forgotPasswordMutation, resetPasswordMutation } from "@judie/data/mutations";
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
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();
  const toast = useToast();
  const [success, setSuccess] = useState(false);
  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    reValidateMode: "onBlur",
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: resetPasswordMutation,
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
    password,
    confirmPassword,
  }: SubmitData) => {
    try {
      // Check for password match
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please make sure your passwords match.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      // Check for token
      const token = router.query.token as string;
      if (!token) {
        toast({
          title: "Missing token in link",
          description: "Please check your email for the link to reset your password, or request a new one.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      await mutateAsync({
        password,
        token,
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
    >{success ? (
        <Flex
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Password Reset
          </Text>
          <Text
            style={{
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
          >
            Your password has been reset. You can now sign in with your new password.
          </Text>
          <Button
            style={{
              width: "100%",
            }}
            colorScheme="blue"
            variant={"solid"}
            label="Sign In"
            onClick={() => {
              router.push({
                pathname: "/signin",
                query: router.query,
              });
            }}
          />
        </Flex>
    ): (
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
            Enter your new password below.
          </Text>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type={"password"}
              autoComplete="password"
              required
              placeholder="Password"
              {...register("password", {})}
            />
          </FormControl>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              type={"confirmPassword"}
              autoComplete="confirmPassword"
              required
              placeholder="Confirm Password"
              {...register("confirmPassword", {})}
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
          colorScheme="blue"
          variant={"solid"}
          loading={isLoading}
          label="Reset Password"
          type="submit"
        />
      </form>
    )}
      
    </Flex>
  );
};

const ResetPassword = () => {
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
            Reset your password
          </Text>
          <ResetPasswordForm />
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

ResetPassword.displayName = "Reset Password";

export default ResetPassword;
