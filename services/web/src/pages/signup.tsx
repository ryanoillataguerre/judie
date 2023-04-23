import Navbar from "@judie/components/Navbar/Navbar";
import { HTTPResponseError, SESSION_COOKIE } from "@judie/data/baseFetch";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import styles from "../styles/Signup.module.scss";
import { useMutation } from "react-query";
import { signupMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { useState } from "react";
import Input from "@judie/components/Input/Input";
import Button, { ButtonVariant } from "@judie/components/Button/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Checkbox, Select, useToast } from "@chakra-ui/react";
import { UserRole } from "@judie/data/types/api";
import inputStyles from "@judie/components/Input/Input.module.scss";
import Link from "next/link";

interface SubmitData {
  email: string;
  password: string;
  name: string;
  receivePromotions: boolean;
  role: UserRole;
  district?: string;
}

const SignupForm = () => {
  const router = useRouter();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SubmitData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      receivePromotions: true,
      role: UserRole.STUDENT,
      district: "",
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
  const [isAnimating, setIsAnimating] = useState(false);

  const onSubmit: SubmitHandler<SubmitData> = async ({
    email,
    password,
    name,
    receivePromotions,
    role,
    district,
  }: SubmitData) => {
    try {
      setHasSubmitted(true);
      if (!termsAndConditions) {
        // Set is animating for 0.5s
        setIsAnimating(true);
        const timeout = setTimeout(() => setIsAnimating(false), 500);
        // clearTimeout(timeout);
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
        name,
        role,
        district,
      });
    } catch (err) {}
  };

  return (
    <form
      className={[
        styles.signupFormContainer,
        isAnimating ? styles.animate : "",
      ].join(" ")}
      onSubmit={handleSubmit(async (data) => await onSubmit(data))}
    >
      <h1>Sign Up</h1>
      <Input
        label={"Name"}
        errors={errors}
        required
        placeholder={""}
        register={register}
        name={"name"}
      />
      <Input
        label={"Email"}
        errors={errors}
        required
        placeholder={"judie@judie.ai"}
        register={register}
        name={"email"}
      />
      <Input
        label={"Password"}
        errors={errors}
        required
        type="password"
        minLength={6}
        register={register}
        name={"password"}
      />
      <label className={[inputStyles.label, inputStyles.required].join(" ")}>
        Role
      </label>
      <Select {...register("role")} className={styles.roleSelector}>
        <option value={UserRole.STUDENT}>Student</option>
        <option value={UserRole.TEACHER}>Teacher</option>
        <option value={UserRole.ADMINISTRATOR}>Administrator</option>
      </Select>
      <Input
        register={register}
        name={"district"}
        errors={errors}
        label={"District"}
      />
      <div className={styles.bottomRow}>
        <Checkbox
          onChange={(e) => setReceivePromotions(e.target.checked)}
          defaultChecked
          checked={receivePromotions}
          marginY={1}
        >
          <p className={styles.checkboxText}>Receive Emails from JudieAI</p>
        </Checkbox>
        <Checkbox
          onChange={(e) => setTermsAndConditions(e.target.checked)}
          checked={termsAndConditions}
          isInvalid={hasSubmitted && !termsAndConditions}
          marginY={1}
        >
          <p className={styles.checkboxText}>
            I agree to the Terms & Conditions
          </p>
        </Checkbox>
      </div>
      <div className={styles.switchAuthRow}>
        <p>Already have an account?</p>
        <a
          onClick={() => {
            router.push({
              pathname: "/signin",
              query: router.query,
            });
          }}
        >
          Sign In
        </a>
      </div>
      <Button
        loading={isLoading}
        className={styles.submitButton}
        label="Sign Up"
        variant={ButtonVariant.Blue}
        type="submit"
      />
    </form>
  );
};

const SignupPage = () => {
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
      <main className={styles.main}>
        <div className={styles.pageContentContainer}>
          <img
            src={"/logo_dark.svg"}
            alt={"Judie Logo"}
            className={styles.logo}
          />
          <h1 className={styles.pageHeader}>Welcome to Judie</h1>
          <SignupForm />
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    req: { cookies },
  } = context;

  if (cookies?.[SESSION_COOKIE]) {
    return {
      redirect: {
        permanent: false,
        destination: "/chat",
      },
    };
  }
  return { props: {} };
}

export default SignupPage;
