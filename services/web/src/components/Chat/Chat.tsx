import {
  completionFromQueryMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { useMutation, useQuery } from "react-query";
import styles from "./Chat.module.scss";
import {
  FormEventHandler,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import MessageRow, { TempMessage } from "../MessageRow/MessageRow";
import { useRouter } from "next/router";
import {
  Message,
  MessageType,
  SubscriptionStatus,
} from "@judie/data/types/api";
import Loading from "../lottie/Loading/Loading";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { Progress, useToast } from "@chakra-ui/react";
import ChatInput from "../ChatInput/ChatInput";
import ChatWelcome from "../ChatWelcome/ChatWelcome";
import useAuth from "@judie/hooks/useAuth";
import Paywall from "../Paywall/Paywall";

interface ChatProps {
  initialQuery?: string;
  chatId: string;
}

const Chat = ({ initialQuery, chatId }: ChatProps) => {
  const router = useRouter();
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayWelcome, setDisplayWelcome] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const { userData, refresh: refreshUserData } = useAuth();
  const { refetch: fetchExistingChat } = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    queryFn: () => getChatByIdQuery(chatId),
    onSuccess: (data) => {
      if (data?.subject) {
        setDisplayWelcome(false);
      } else {
        setDisplayWelcome(true);
      }
      setMessages(data?.messages);
    },
    enabled: !!chatId,
  });

  useEffect(() => {
    if (chatId) {
      fetchExistingChat();
    }
  }, [chatId, fetchExistingChat]);

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () =>
      completionFromQueryMutation({
        query: chatValue,
        chatId,
      }),
    onError: () => {
      toast({
        title: "Oops!",
        description: "Something went wrong, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      if (data) {
        setMostRecentUserChat(undefined);
        if (data?.messages) {
          setMessages(data?.messages);
        }
        refreshUserData();
      }
    },
    retry: false,
  });

  // Suck query param into text box for clean path
  const [chatValue, setChatValue] = useState<string>(initialQuery || "");
  useEffect(() => {
    if (chatValue.length > 0 && chatValue === initialQuery) {
      // Remove query param
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [chatValue, router, initialQuery]);

  const [mostRecentUserChat, setMostRecentUserChat] = useState<TempMessage>();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) {
      toast({
        title: "Please wait for the previous message to respond",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (
      (userData?.questionsAsked || 0) >= 10 &&
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

  const reversedMessages = useMemo(() => {
    return messages?.reverse();
  }, [messages]);

  useEffect(() => {
    if (mostRecentUserChat || reversedMessages.length > 0) {
      setDisplayWelcome(false);
    }
  }, [mostRecentUserChat, reversedMessages]);

  const putChat = useMutation({
    mutationFn: putChatMutation,
  });
  const onSelectSubject = (subject: string) => {
    // Set subject on chat in DB
    putChat.mutate(
      {
        chatId,
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

  return (
    <div className={styles.chatContainer}>
      <Paywall isOpen={isPaywallOpen} setIsOpen={setIsPaywallOpen} />
      {displayWelcome ? (
        <div className={styles.welcomeContainer}>
          <ChatWelcome selectSubject={onSelectSubject} />
        </div>
      ) : (
        <div className={styles.conversationContainer}>
          {mostRecentUserChat && <MessageRow message={mostRecentUserChat} />}
          {reversedMessages?.map((message, index) => (
            <MessageRow key={index} message={message} />
          ))}
        </div>
      )}
      <form onSubmit={onSubmit} className={styles.chatBoxContainer}>
        {isLoading && (
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
