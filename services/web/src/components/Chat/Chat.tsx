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

interface ChatProps {
  initialQuery?: string;
}

const Chat = ({ initialQuery }: ChatProps) => {
  const router = useRouter();

  const [chatId, setChatId] = useStorageState("chat", "chatId");
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
      if (chatId !== data?.id) {
        setChatId(data?.id);
      }
      data?.messages.unshift();
      setMostRecentUserChat(undefined);
      setMessages(data?.messages);
    },
    retry: false,
  });

  // Suck query param into text box for clean path
  const [chatValue, setChatValue] = useState<string>(initialQuery || "");
  useEffect(() => {
    if (chatValue.length > 0) {
      // Remove query param
      router.replace(router.pathname, undefined, { shallow: true });
    }
    if (!chatId) {
      (async () => {
        const result = await fetchExistingChat();
        if (result?.data?.id) {
          setChatId(result?.data?.id);
          setMessages(result?.data?.messages);
        } else {
          setChatId("");
          setMessages([]);
        }
      })();
    }
  }, [
    chatValue.length,
    fetchExistingChat,
    router,
    setChatId,
    setMessages,
    chatId,
  ]);

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
      newChat: !chatId,
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
        setChatValue("");
        await mutateAsync({
          query: chatValue,
          // When do we want to make a new chat? Maybe a button?
          newChat: !chatId,
        });
      })();
    }
  }, [initialQuery, chatValue, chatId, mutateAsync]);

  const reversedMessages = useMemo(() => {
    return messages?.reverse();
  }, [messages]);

  return (
    <Suspense fallback={<Loading />}>
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
          <input
            placeholder={"What is mitosis?"}
            className={styles.chatBoxInput}
            onChange={(e) => setChatValue(e.target.value)}
            value={chatValue}
          />
        </form>
      </div>
    </Suspense>
  );
};

export default Chat;
