import { HTTPResponseError } from "@judie/data/baseFetch";
import Head from "next/head";
import { useMutation } from "react-query";
import { redeemInviteMutation, signupMutation } from "@judie/data/mutations";
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
  Spinner,
  Select,
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import useUnauthRedirect from "@judie/hooks/useUnauthRedirect";
import { UserRole } from "@judie/data/types/api";

export interface SignupSubmitData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  receivePromotions: boolean;
  districtOrSchool?: string;
}

export const SignupForm = ({
  inviteEmail,
  inviteId,
}: {
  inviteEmail?: string;
  inviteId?: string;
}) => {
  const router = useRouter();
  const toast = useToast();
  const { handleSubmit, register } = useForm<SignupSubmitData>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: UserRole.STUDENT,
      districtOrSchool: "",
      receivePromotions: true,
    },
    reValidateMode: "onBlur",
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: signupMutation,
    onSuccess: () => {
      router.push({
        pathname: "/dashboard",
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

  const { mutateAsync: mutateAsyncInvite, isLoading: inviteSignupLoading } =
    useMutation({
      mutationFn: redeemInviteMutation,
      onSuccess: () => {
        router.push({
          pathname: "/dashboard",
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
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const onSubmit: SubmitHandler<SignupSubmitData> = async ({
    email,
    password,
    firstName,
    lastName,
    receivePromotions,
    role,
    districtOrSchool,
  }: SignupSubmitData) => {
    try {
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

      if (inviteEmail) {
        await mutateAsyncInvite({
          password,
          receivePromotions,
          firstName: firstName as string,
          lastName: lastName as string,
          inviteId: inviteId as string,
        });
        return;
      } else {
        await mutateAsync({
          email,
          password,
          receivePromotions,
          firstName,
          lastName,
          role,
          districtOrSchool,
        });
      }
    } catch (err) {}
  };

  // Styles
  const formWidth = useBreakpointValue({
    base: "100%",
    md: "60%",
    lg: "40%",
  });
  const formBgColor = useColorModeValue("white", "#2a3448");

  const isInvite = !!inviteEmail;

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
            Sign Up
          </Text>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
            isRequired
          >
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type={"email"}
              autoComplete="email"
              required
              placeholder="judie@judie.io"
              {...register("email", {})}
              isReadOnly={isInvite}
              {...(isInvite
                ? {
                    value: inviteEmail,
                  }
                : {})}
              disabled={isInvite}
            />
          </FormControl>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
            isRequired
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
            isRequired={!isInvite}
          >
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              autoComplete="given-name"
              required={!isInvite}
              placeholder="Judie"
              {...register("firstName", {})}
            />
          </FormControl>
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
            isRequired={!isInvite}
          >
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              autoComplete="family-name"
              required={!isInvite}
              placeholder="Thebot"
              {...register("lastName")}
            />
          </FormControl>
          {!inviteEmail && (
            <FormControl paddingTop={2}>
              <FormLabel htmlFor="districtOrSchool">Role</FormLabel>
              <Select
                {...register("role")}
                onChange={(e) => setRole(e.target.value as UserRole)}
                marginBottom={6}
              >
                <option value={UserRole.STUDENT}>Student</option>
                <option value={UserRole.TEACHER}>Teacher</option>
                <option value={UserRole.ADMINISTRATOR}>Administrator</option>
              </Select>
              {(role === UserRole.ADMINISTRATOR ||
                role === UserRole.TEACHER) && (
                <FormControl marginBottom={6} isRequired>
                  <FormLabel htmlFor="districtOrSchool">
                    {role === UserRole.ADMINISTRATOR ? "District" : "School"}
                  </FormLabel>
                  <Input
                    id="districtOrSchool"
                    required
                    {...register("districtOrSchool", {})}
                  />
                </FormControl>
              )}
            </FormControl>
          )}
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
            <Text fontSize={"0.8rem"}>
              I agree to the{" "}
              <Link
                textDecor={"underline"}
                target="_blank"
                href="https://judie.io/terms"
              >
                Terms & Conditions
              </Link>
            </Text>
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
          variant={"purp"}
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
  useUnauthRedirect();
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
          <Text variant={"headerLight"} marginBottom={"1rem"}>
            Welcome to Judie
          </Text>
          <SignupForm />
        </Flex>
      </main>
    </>
  );
};

SignupPage.displayName = "Sign Up";

export default SignupPage;
