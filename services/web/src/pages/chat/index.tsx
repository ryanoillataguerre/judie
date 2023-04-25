import { GetServerSidePropsContext } from "next";
import styles from "../../styles/Chat.module.scss";
import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { createChatMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
interface ChatPageProps {
  query?: string;
}
export default function ChatPage({ query }: ChatPageProps) {
  useAuth();
  const { data, isError, isLoading } = useQuery({
    queryKey: [GET_USER_CHATS],
    queryFn: () => getUserChatsQuery(),
    enabled: true,
    onSuccess: (data) => {
      if (data.length) {
        router.push({
          pathname: `/chat/${data[0].id}`,
          query: router.query,
        });
      }
    },
    staleTime: 1000 * 60,
  });
  const { mutateAsync } = useMutation({
    mutationFn: createChatMutation,
  });
  const [newChatId, setNewChatId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!data?.length && !isError && !isLoading) {
      (async () => {
        const newChat = await mutateAsync();
        setNewChatId(newChat.id);
      })();
    }
  }, [mutateAsync, data, isError, isLoading, setNewChatId]);

  useEffect(() => {
    if (newChatId) {
      router.push({
        pathname: `/chat/${newChatId}`,
        query: router.query,
      });
    }
  }, [newChatId, router]);
  return (
    <>
      <Head>
        <title>Judie - Chat</title>
        <meta
          name="description"
          content="Welcome to Judie! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingScreen />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get query parameter "query" and pass in as a prop
  const query = context.query.query;
  return {
    props: {
      query: query || null,
    },
  };
}
