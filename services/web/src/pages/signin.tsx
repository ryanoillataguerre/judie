import Navbar from "@judie/components/Navbar/Navbar";
import { SESSION_COOKIE } from "@judie/data/baseFetch";
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

interface SubmitData {
  email: string;
  password: string;
}

const SigninForm = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate } = useMutation({
    mutationFn: signinMutation,
    onSuccess: () => {
      router.push("/chat");
    },
  });
  const onSubmit: SubmitHandler<SubmitData> = ({
    email,
    password,
  }: SubmitData) => {
    try {
      mutate({
        email,
        password,
      });
      router.push("/chat");
    } catch (err) {
      // TODO: Toast error with err message
    }
  };

  return (
    <form
      className={styles.signinFormContainer}
      onSubmit={handleSubmit(onSubmit)}
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
