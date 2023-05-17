import {
  completionFromQueryMutation,
  createChatMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { useMutation, useQuery } from "react-query";
import styles from "./Chat.module.scss";
import { FormEventHandler, useEffect, useState } from "react";
import MessageRow, { TempMessage } from "../MessageRow/MessageRow";
import { useRouter } from "next/router";
import {
  Message,
  MessageType,
  SubscriptionStatus,
} from "@judie/data/types/api";
import {
  GET_CHAT_BY_ID,
  GET_USER_CHATS,
  getChatByIdQuery,
  getUserChatsQuery,
} from "@judie/data/queries";
import { Progress, useToast } from "@chakra-ui/react";
import ChatInput from "../ChatInput/ChatInput";
import ChatWelcome from "../ChatWelcome/ChatWelcome";
import useAuth from "@judie/hooks/useAuth";
import Paywall from "../Paywall/Paywall";

import { HTTPResponseError } from "@judie/data/baseFetch";

interface ChatProps {
  initialQuery?: string;
  chatId: string;
}

const Chat = ({ initialQuery }: ChatProps) => {
  const router = useRouter();
  const toast = useToast();
  const auth = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayWelcome, setDisplayWelcome] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [beingStreamedMessage, setBeingStreamedMessage] = useState<string>("");
  const { userData, refresh: refreshUserData } = useAuth();
  const [chatId, setChatId] = useState<string>(router?.query?.id as string);

  // Get user chats on initial load -
  // if there's no chatId and no newChat query param, set it to their most recent chat
  const {
    data,
    isError,
    isLoading: initialChatLoading,
  } = useQuery({
    queryKey: [GET_USER_CHATS],
    queryFn: () => getUserChatsQuery(),
    enabled: true,
    onSuccess: (data) => {
      if (data.length && !router.query.newChat && data?.[0]?.id) {
        setChatId(data[0].id);
        router.push(
          {
            pathname: `/chat`,
            query: {
              id: data[0].id,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error getting chats", err);
      auth.logout();
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (chatId) {
      setDisplayWelcome(false);
    }
    if (!chatId) {
      setDisplayWelcome(true);
    }
  }, [chatId]);

  const { mutateAsync: createChat } = useMutation({
    mutationFn: createChatMutation,
    onSuccess: (data) => {
      setChatId(data.id);
      router.push(
        `/chat`,
        {
          query: {
            id: data.id,
          },
        },
        { shallow: true }
      );
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error creating chat", err);
      auth.logout();
    },
  });

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () =>
      completionFromQueryMutation({
        query: chatValue,
        chatId,
        setChatValue: streamCallback,
        onStreamEnd: () => {
          refreshUserData();
          fetchExistingChat();
        },
      }),
    onError: (err: HTTPResponseError) => {
      toast({
        title: "Oops!",
        description: err.message || "Something went wrong, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
    retry: false,
  });

  const { refetch: fetchExistingChat } = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    queryFn: () => getChatByIdQuery(chatId),
    onSuccess: (data) => {
      if (data?.subject || data?.messages?.length > 0) {
        setDisplayWelcome(false);
      } else {
        setDisplayWelcome(true);
      }
      setMessages(data?.messages);
      if (!isLoading && data?.messages?.length > 0) {
        setMostRecentUserChat(undefined);
        setBeingStreamedMessage("");
      }
    },
    enabled: !!chatId,
  });

  const streamCallback = (message: string) => {
    setBeingStreamedMessage((prev) => prev + message);
  };

  // Suck query param into text box for clean path
  const [chatValue, setChatValue] = useState<string>(initialQuery || "");
  useEffect(() => {
    if (chatValue.length > 0 && chatValue === initialQuery) {
      // Remove query param
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [chatValue, router, initialQuery]);

  const [mostRecentUserChat, setMostRecentUserChat] = useState<TempMessage>();

  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (chatValue.length === 0) {
      return;
    }
    if (!chatId) {
      await createChat();
    }
    if (beingStreamedMessage.length > 0) {
      toast({
        title: "Please wait for the previous message to respond",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (
      (userData?.questionsAsked || 0) >= 3 &&
      !(userData?.subscription?.status === SubscriptionStatus.ACTIVE)
    ) {
      setIsPaywallOpen(true);
      return;
    }
    setMostRecentUserChat({
      type: MessageType.USER,
      readableContent: chatValue,
      createdAt: new Date(),
    });
    setChatValue("");
    await mutateAsync();
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery && chatValue === initialQuery) {
      (async () => {
        setMostRecentUserChat({
          type: MessageType.USER,
          readableContent: chatValue,
          createdAt: new Date(),
        });
        await mutateAsync();
        setChatValue("");
      })();
    }
  }, [initialQuery, chatValue, chatId, mutateAsync]);

  useEffect(() => {
    if (mostRecentUserChat || messages.length > 0) {
      setDisplayWelcome(false);
    }
  }, [mostRecentUserChat, messages]);

  const putChat = useMutation({
    mutationFn: putChatMutation,
  });
  const onSelectSubject = async (subject: string) => {
    let newChatId = undefined;
    if (!chatId) {
      const newChat = await createChat();
      newChatId = newChat.id;
    }
    await putChat.mutateAsync(
      {
        chatId: newChatId || chatId,
        subject,
      },
      {
        onSuccess: () => {
          setDisplayWelcome(false);
          fetchExistingChat();
        },
      }
    );
  };

  // If new chat, create new chat
  useEffect(() => {
    if (router.query.newChat && !chatId) {
      (async () => {
        const newChat = await createChat();
        router.push(
          `/chat`,
          {
            query: {
              id: newChat.id,
            },
          },
          { shallow: true }
        );
      })();
    }
  }, [router.query.newChat, createChat, router.push]);

  return (
    <div className={styles.chatContainer}>
      <Paywall isOpen={isPaywallOpen} setIsOpen={setIsPaywallOpen} />
      {displayWelcome ? (
        <div className={styles.welcomeContainer}>
          <ChatWelcome selectSubject={onSelectSubject} />
        </div>
      ) : (
        <div className={styles.conversationContainer}>
          <div className={styles.reverseFlexContainer}>
            {messages?.map((message, index) => {
              if (
                message.type === MessageType.USER &&
                message.readableContent ===
                  mostRecentUserChat?.readableContent &&
                index === messages.length - 1
              ) {
                setMostRecentUserChat(undefined);
              }
              return <MessageRow key={index} message={message} />;
            })}
            {mostRecentUserChat && <MessageRow message={mostRecentUserChat} />}
            {beingStreamedMessage && (
              <MessageRow
                message={{
                  type: MessageType.BOT,
                  readableContent: beingStreamedMessage,
                  createdAt: new Date(),
                }}
              />
            )}
          </div>
        </div>
      )}
      <form onSubmit={onSubmit} className={styles.chatBoxContainer}>
        {(isLoading || loading) && (
          <Progress
            size="xs"
            isIndeterminate
            width={"100%"}
            colorScheme={"green"}
            background="transparent"
          />
        )}
        <ChatInput chatValue={chatValue} setChatValue={setChatValue} />
      </form>
    </div>
  );
};

export default Chat;
