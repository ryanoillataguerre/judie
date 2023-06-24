import Head from "next/head";
import styles from "@judie/styles/Home.module.scss";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import useAuth from "@judie/hooks/useAuth";
import useUnauthRedirect from "@judie/hooks/useUnauthRedirect";
const Home = () => {
  // const { userData } = useAuth({ allowUnauth: true });
  // const [query, setQuery] = useState<string>("");
  // const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   if (userData) {
  //     const url = `/chat?query=${query}`;
  //     if (router?.isReady) {
  //       router?.push(url);
  //     }
  //   } else {
  //     const url = `/signup?query=${query}`;
  //     if (router?.isReady) {
  //       router?.push(url);
  //     }
  //   }
  // };
  useAuth({ allowUnauth: true })

  useUnauthRedirect();

  return (
    <>
      <Head>
        <title>Judie</title>
        <meta
          name="description"
          content="Judie is an advanced tutor chat that runs on OpenAI's ChatGPT"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <LoadingScreen />
      </main>
    </>
  );
};
Home.displayName = "Home";

export default Home;
