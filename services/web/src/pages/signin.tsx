import { HTTPResponseError } from "@judie/data/baseFetch";
import Head from "next/head";
import { useMutation } from "react-query";
import {
  CREATE_CHECKOUT_SESSION,
  createCheckoutSessionMutation,
  signinMutation,
} from "@judie/data/mutations";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  Spinner,
  Button,
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { SubscriptionStatus, User } from "@judie/data/types/api";

interface SubmitData {
  email: string;
  password: string;
}

const SigninForm = () => {
  const router = useRouter();
  const toast = useToast();

  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onBlur",
  });

  const redirectUrl = useMemo(() => {
    return typeof window !== "undefined"
      ? `${window.location.origin}/dashboard`
      : "";
  }, []);

  const { mutateAsync: createCheckoutSession } = useMutation({
    mutationKey: CREATE_CHECKOUT_SESSION,
    mutationFn: () => createCheckoutSessionMutation(redirectUrl),
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: signinMutation,
    onSuccess: async (response: User) => {
      // Check if user has sub
      if (response.subscription?.status === SubscriptionStatus.ACTIVE) {
        // Redirect to chat
        router.push({
          pathname: "/chat",
          query: {
            ...router.query,
            fresh: true,
          },
        });
      } else {
        // Get checkout session URL
        const url = await createCheckoutSession();
        // Redirect to checkout
        window?.location?.assign(url);
      }
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error signing in", err);
      toast({
        title: "Error signing in",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<SubmitData> = async ({
    email,
    password,
  }: SubmitData) => {
    try {
      setHasSubmitted(true);

      await mutateAsync({
        email,
        password,
      });
    } catch (err) {}
  };

  // Styles
  const formWidth = useBreakpointValue(
    {
      base: "100%",
      sm: "70%",
      md: "50%",
      lg: "40%",
    },
    { fallback: "60%" }
  );
  const formBgColor = useColorModeValue("white", "#2a3448");

  return typeof window === "undefined" ? (
    <Spinner colorScheme="blue" />
  ) : (
    <Flex
      style={{
        width: formWidth,
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: formBgColor,
        padding: "1.5rem",
        borderRadius: "0.5rem",
      }}
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
              fontSize: "1.5rem",
            }}
          >
            Sign In
          </Text>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              tabIndex={1}
              id="email"
              type={"email"}
              autoComplete="email"
              required
              placeholder="judie@judie.io"
              {...register("email", {})}
            />
          </FormControl>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
              <InputRightElement>
                <IconButton
                  variant="link"
                  aria-label={
                    showPassword ? "Mask password" : "Reveal password"
                  }
                  icon={showPassword ? <HiEyeOff /> : <HiEye />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
              <Input
                tabIndex={2}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Password"
                {...register("password", {})}
              />
            </InputGroup>
          </FormControl>
        </Flex>
        <Flex
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <Text
            style={{
              fontSize: "1rem",
            }}
          >
            Don&apos;t have an account yet?
          </Text>
          <Link
            color="teal"
            style={{
              fontSize: "1rem",
            }}
            onClick={() => {
              router.push({
                pathname: "/signup",
                query: router.query,
              });
            }}
          >
            Sign Up
          </Link>
        </Flex>
        <Flex
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Link
            color="teal"
            style={{
              fontSize: "1rem",
            }}
            onClick={() => {
              router.push({
                pathname: "/forgot-password",
                query: router.query,
              });
            }}
          >
            Forgot Password?
          </Link>
        </Flex>
        <Button
          style={{
            width: "100%",
          }}
          // colorScheme="blue"
          variant={"purp"}
          isLoading={isLoading}
          type="submit"
          size={"md"}
        >
          Sign In
        </Button>
      </form>
    </Flex>
  );
};

const SigninPage = () => {
  const router = useRouter();
  useAuth({ allowUnauth: true });
  // const { logout } = useAuth();
  // const [sessionCookie] = useState(getCookie(SESSION_COOKIE));
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");

  return (
    <>
      <Head>
        <title>Judie - Sign In</title>
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
          <Text variant={"headerLight"} marginBottom={"1rem"}>
            Welcome back!
          </Text>
          {router.isReady && <SigninForm />}
        </Flex>
      </main>
    </>
  );
};

SigninPage.displayName = "Sign In";

export default SigninPage;
