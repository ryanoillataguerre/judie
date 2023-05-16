import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { createChatMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { HTTPResponseError } from "@judie/data/baseFetch";
interface ChatPageProps {
  query?: string;
}
export default function ChatPage({ query }: ChatPageProps) {
  const auth = useAuth();
  const router = useRouter();
  const { data, isError, isLoading } = useQuery({
    queryKey: [GET_USER_CHATS],
    queryFn: () => getUserChatsQuery(),
    enabled: true,
    onSuccess: (data) => {
      if (data.length && !router.query.newChat && data?.[0]?.id) {
        router.push({
          pathname: `/chat/${data[0].id}`,
          query: router.query,
        });
      }
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error getting chats", err);
      auth.logout();
    },
    staleTime: 1000 * 60,
  });
  const { mutateAsync } = useMutation({
    mutationFn: createChatMutation,
    onError: (err: HTTPResponseError) => {
      console.error("Error creating chat", err);
      auth.logout();
    },
  });
  const [newChatId, setNewChatId] = useState<string | null>(null);
  useEffect(() => {
    if ((!data?.length && !isError && !isLoading) || router.query.newChat) {
      (async () => {
        const newChat = await mutateAsync();
        setNewChatId(newChat.id);
      })();
    }
  }, [mutateAsync, data, isError, isLoading, setNewChatId, router.query]);

  useEffect(() => {
    if (newChatId) {
      delete router.query.newChat;
      router.push({
        pathname: `/chat/${newChatId}`,
        query: {
          ...router.query,
        },
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
