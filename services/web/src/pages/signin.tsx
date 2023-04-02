import { HTTPResponseError, SESSION_COOKIE } from "@judie/data/baseFetch";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import styles from "../styles/Signin.module.scss";
import { useMutation } from "react-query";
import { signinMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import Input from "@judie/components/Input/Input";
import Button, { ButtonVariant } from "@judie/components/Button/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";

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
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: signinMutation,
    onSuccess: () => {
      router.push({
        pathname: "/chat",
        query: router.query,
      });
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error signing in", err);
      toast({
        title: "Error signing in",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
  const onSubmit: SubmitHandler<SubmitData> = async ({
    email,
    password,
  }: SubmitData) => {
    try {
      await mutateAsync({
        email,
        password,
      });
    } catch (err) {}
  };

  return (
    <form
      className={styles.signinFormContainer}
      onSubmit={handleSubmit(async (data) => await onSubmit(data))}
    >
      <h1>Sign In</h1>
      <label>Email</label>
      <Input
        placeholder={"judie@judie.ai"}
        register={register}
        name={"email"}
      />
      <label>Password</label>
      <Input type="password" register={register} name={"password"} />
      <Button
        loading={isLoading}
        className={styles.submitButton}
        label="Sign In"
        variant={ButtonVariant.Blue}
        type="submit"
      />
    </form>
  );
};

const SigninPage = () => {
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
      <main className={styles.main}>
        <div className={styles.pageContentContainer}>
          <img
            src={"/logo_dark.svg"}
            alt={"Judie Logo"}
            className={styles.logo}
          />
          <h1 className={styles.pageHeader}>Welcome back</h1>
          <SigninForm />
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

export default SigninPage;
