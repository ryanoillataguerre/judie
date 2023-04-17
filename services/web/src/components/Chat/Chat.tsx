import { completionFromQueryMutation } from "@judie/data/mutations";
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
import { Message, MessageType } from "@judie/data/types/api";
import useStorageState from "@judie/hooks/useStorageState";
import Loading from "../lottie/Loading/Loading";
import { GET_ACTIVE_CHAT, getUserActiveChatQuery } from "@judie/data/queries";
import { Progress } from "@chakra-ui/react";
import ChatInput from "../ChatInput/ChatInput";

interface ChatProps {
  initialQuery?: string;
  chatId: string;
}

const Chat = ({ initialQuery, chatId }: ChatProps) => {
  const router = useRouter();
  const [messages, setMessages] = useStorageState<Message[]>(
    [],
    chatId ?? "messages"
  );

  const {
    data: existingUserChat,
    isLoading: isExistingChatLoading,
    refetch: fetchExistingChat,
  } = useQuery({
    queryKey: [GET_ACTIVE_CHAT],
    queryFn: () => getUserActiveChatQuery(),
    enabled: false,
  });

  const {
    isLoading,
    data: completionMutationData,
    isError,
    mutateAsync,
  } = useMutation({
    mutationFn: completionFromQueryMutation,
    onError: (error) => {
      console.error("Error getting completion", error);
    },
    onSuccess: (data) => {
      data?.messages.unshift();
      setMostRecentUserChat(undefined);
      setMessages(data?.messages);
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
    if (!chatId) {
      (async () => {
        const result = await fetchExistingChat();
        if (result?.data?.id) {
          setMessages(result?.data?.messages);
        } else {
          setMessages([]);
        }
      })();
    }
  }, [chatValue.length, fetchExistingChat, router, setMessages, chatId]);

  const [mostRecentUserChat, setMostRecentUserChat] = useState<TempMessage>();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMostRecentUserChat({
      type: MessageType.USER,
      readableContent: chatValue,
      createdAt: new Date(),
    });
    setChatValue("");
    await mutateAsync({
      query: chatValue,
      // When do we want to make a new chat? Maybe a button?
      chatId,
    });
  };

  useEffect(() => {
    if (initialQuery && chatValue === initialQuery) {
      (async () => {
        setMostRecentUserChat({
          type: MessageType.USER,
          readableContent: chatValue,
          createdAt: new Date(),
        });
        await mutateAsync({
          query: chatValue,
          chatId,
        });
        setChatValue("");
      })();
    }
  }, [initialQuery, chatValue, chatId, mutateAsync]);

  const reversedMessages = useMemo(() => {
    return messages?.reverse();
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.conversationContainer}>
        {mostRecentUserChat && <MessageRow message={mostRecentUserChat} />}
        {reversedMessages?.map((message, index) => (
          <MessageRow key={index} message={message} />
        ))}
      </div>
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
