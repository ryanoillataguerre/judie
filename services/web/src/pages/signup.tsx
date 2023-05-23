import { HTTPResponseError } from "@judie/data/baseFetch";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useMutation } from "react-query";
import { signupMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "@judie/components/Button/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Checkbox,
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
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import { serverRedirect } from "@judie/utils/middleware/redirectToWaitlist";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface SubmitData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  receivePromotions: boolean;
}

const SignupForm = () => {
  const router = useRouter();
  const toast = useToast();
  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      receivePromotions: true,
    },
    reValidateMode: "onBlur",
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: signupMutation,
    onSuccess: () => {
      router.push({
        pathname: "/chat",
        query: router.query,
      });
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error signing up", err);
      toast({
        title: "Error signing up",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const [receivePromotions, setReceivePromotions] = useState(true);
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<SubmitData> = async ({
    email,
    password,
    firstName,
    lastName,
    receivePromotions,
  }: SubmitData) => {
    try {
      console.log({
        email,
        password,
        firstName,
        lastName,
        receivePromotions,
      });
      setHasSubmitted(true);
      if (!termsAndConditions) {
        toast({
          title: "Oops, not yet!",
          description: "You must first agree to the terms and conditions",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await mutateAsync({
        email,
        password,
        receivePromotions,
        firstName,
        lastName,
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
              fontSize: "1.5rem",
            }}
          >
            Sign Up
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
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Password"
                {...register("password", {})}
              />
            </InputGroup>
          </FormControl>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              autoComplete="firstName"
              required
              placeholder="Judie"
              {...register("firstName", {})}
            />
          </FormControl>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              autoComplete="lastName"
              required
              placeholder="Thebot"
              {...register("lastName", {})}
            />
          </FormControl>
          <Checkbox
            onChange={(e) => setReceivePromotions(e.target.checked)}
            defaultChecked
            checked={receivePromotions}
            marginY={1}
          >
            <Text fontSize={"0.8rem"}>Receive Emails from JudieAI</Text>
          </Checkbox>
          <Checkbox
            onChange={(e) => setTermsAndConditions(e.target.checked)}
            checked={termsAndConditions}
            isInvalid={hasSubmitted && !termsAndConditions}
            marginY={1}
          >
            <Text fontSize={"0.8rem"}>I agree to the Terms & Conditions</Text>
          </Checkbox>
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
            Already have an account?
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
          label="Sign Up"
          type="submit"
        />
      </form>
    </Flex>
  );
};

const SignupPage = () => {
  useAuth({ allowUnauth: true });
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
  return (
    <>
      <Head>
        <title>Judie - Sign Up</title>
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
            Welcome to Judie
          </Text>
          <SignupForm />
        </Flex>
      </main>
    </>
  );
};

// Redirect users to chat if authed
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (ctx.req.cookies.judie_sid) {
    return serverRedirect(ctx, "/chat");
  }
  return { props: {} };
};

SignupPage.displayName = "Sign Up";

export default SignupPage;
