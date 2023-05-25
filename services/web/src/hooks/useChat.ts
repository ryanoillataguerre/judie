import {
  ChatResponse,
  completionFromQueryMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { Message, MessageType } from "@judie/data/types/api";
import { useMutation, useQuery } from "react-query";
import useAuth from "./useAuth";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HTTPResponseError } from "@judie/data/baseFetch";

export interface TempMessage {
  type?: MessageType.BOT | MessageType.USER;
  readableContent?: string;
  createdAt?: Date;
}

type UIMessageType = Message | TempMessage;

interface UseChatData {
  chat?: ChatResponse;
  loading: boolean;
  addMessage: (message: string) => void;
  messages: UIMessageType[];
  beingStreamedMessage?: string;
  displayWelcome: boolean;
  paywallOpen?: boolean;
  submitSubject: (subject: string) => void;
}

const useChat = ({ chatId }: { chatId?: string }): UseChatData => {
  const auth = useAuth();
  const toast = useToast();
  const [displayWelcome, setDisplayWelcome] = useState(true);
  const [messages, setMessages] = useState<UIMessageType[]>([]);
  const [beingStreamedMessage, setBeingStreamedMessage] = useState<
    string | undefined
  >(undefined);
  const [paywallOpen, setPaywallOpen] = useState<boolean>(false);

  const streamCallback = (message: string) => {
    setBeingStreamedMessage((prev) => prev + message);
  };
  const completionMutation = useMutation({
    mutationFn: ({ query }: { query: string }) =>
      completionFromQueryMutation({
        query,
        chatId,
        setChatValue: streamCallback,
        onStreamEnd: () => {
          auth.refresh();
          existingChatQuery.refetch();
        },
      }),
    onError: (err: HTTPResponseError) => {
      if (err.response?.status === 429) {
        // Rate limited - user is out of questions for the day
        setPaywallOpen(true);
      }
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

  const existingChatQuery = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    queryFn: () => getChatByIdQuery(chatId),
    onSuccess: (data) => {
      if (data?.subject || data?.messages?.length > 0) {
        setDisplayWelcome(false);
      } else {
        setDisplayWelcome(true);
      }
      setMessages(data?.messages);
      if (
        !completionMutation.isLoading &&
        !beingStreamedMessage &&
        data?.messages?.length > 0
      ) {
        setMessages((prev) => {
          // Remove most recent message from arr - this is a TempMessage
          let newMessages = prev;
          newMessages.shift();
          return newMessages;
        });
        setBeingStreamedMessage(undefined);
      }
    },
    enabled: !!chatId && !beingStreamedMessage,
  });

  const putChat = useMutation({
    mutationFn: putChatMutation,
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

  const addMessage = async (prompt: string) => {
    // Guard clauses
    if (prompt.length === 0) {
      return;
    }
    if (!chatId) {
      toast({
        title: "Oops!",
        description:
          "Something went wrong, please create a new chat or refresh.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if ((beingStreamedMessage?.length || 0) > 0) {
      toast({
        title: "Please wait for the previous message to respond",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    // Add TempMessage to messages arr
    setMessages((prev) => [
      ...prev,
      {
        type: MessageType.USER,
        readableContent: prompt,
        createdAt: new Date(),
      },
    ]);
    // Call mutation
    await completionMutation.mutateAsync({ query: prompt });
  };

  // User sets a subject from the chat window
  const submitSubject = async (subject: string) => {
    if (!chatId) {
      toast({
        title: "Oops!",
        description:
          "Something went wrong, please create a new chat or refresh.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    await putChat.mutateAsync({
      chatId,
      subject,
    });
    existingChatQuery.refetch();
  };

  const memoizedValue: UseChatData = useMemo(() => {
    return {
      chat: existingChatQuery.data,
      loading: existingChatQuery.isLoading,
      addMessage,
      messages,
      beingStreamedMessage,
      displayWelcome,
      paywallOpen,
      submitSubject,
    };
  }, [
    addMessage,
    messages,
    beingStreamedMessage,
    displayWelcome,
    paywallOpen,
    existingChatQuery,
    submitSubject,
  ]);
  return memoizedValue;
};

export default useChat;
