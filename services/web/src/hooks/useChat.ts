import {
  ChatResponse,
  completionFromQueryMutation,
  createChatMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { Message, MessageType } from "@judie/data/types/api";
import { useMutation, useQuery } from "react-query";
import useAuth from "./useAuth";
import {  useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HTTPResponseError } from "@judie/data/baseFetch";
import useStorageState from "./useStorageState";
import { useRouter } from "next/router";

export interface TempMessage {
  type?: MessageType.BOT | MessageType.USER;
  readableContent?: string;
  createdAt?: Date;
}

type UIMessageType = Message | TempMessage;

interface UseChatData {
  activeChatId?: string;
  chat?: ChatResponse;
  loading: boolean;
  addMessage: (message: string) => void;
  messages: UIMessageType[];
  beingStreamedMessage?: string;
  displayWelcome: boolean;
  paywallOpen?: boolean;
  submitSubject: (subject: string) => void;
}

const useChat = (): UseChatData => {
  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [displayWelcome, setDisplayWelcome] = useState(true);
  const [messages, setMessages] = useState<UIMessageType[]>([]);
  const [beingStreamedMessage, setBeingStreamedMessage] = useStorageState<
    string | undefined
  >(undefined, "beingStreamedMessage");
  const [paywallOpen, setPaywallOpen] = useState<boolean>(false);

  const chatId = useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);


  const streamCallback = (message: string) => {
    console.log(beingStreamedMessage)
    setBeingStreamedMessage((prev) => prev + message);
  };
  const completionMutation = useMutation({
    mutationFn: ({ query }: { query: string }) => {
      if (chatId) {
        setBeingStreamedMessage(undefined);
        return completionFromQueryMutation({
          query,
          chatId,
          setChatValue: streamCallback,
          onStreamEnd: () => {
            auth.refresh();
            setBeingStreamedMessage(undefined);
            existingChatQuery.refetch();
          },
        });
      } else {
        toast({
          title: "Oops!",
          description:
            "Something went wrong, please create a new chat or refresh.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    },
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

  useEffect(() => {
    setBeingStreamedMessage(undefined);
  }, [chatId])


  const existingChatQuery = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    enabled: !!chatId && !beingStreamedMessage?.length,
    queryFn: () => getChatByIdQuery(chatId as string),
    onSuccess: (data) => {
      if (data?.subject || data?.messages?.length > 0) {
        setDisplayWelcome(false);
      } else {
        setDisplayWelcome(true);
      }
      setMessages(data?.messages);
      if (
        !completionMutation.isLoading &&
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
    onError: (err: HTTPResponseError) => {
      toast({
        title: "Oops!",
        description: err.message || "Something went wrong, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      router.push("/chat");
    },
  });

  // console.log('data', existingChatQuery.data)
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

  const createChat = useMutation({
    mutationFn: createChatMutation,
    onSuccess: (data) => {
      router.push({
        query: {
          id: data.id,
        },
        pathname: "/chat",
      });
    },
  });

  const addMessage = async (prompt: string) => {
    // Guard clauses
    if (!prompt || prompt.length === 0) {
      return;
    }
    if (!chatId) {
      console.error("No chatId found")
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
      console.error("Previous message not finished")
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
      // Create a chat
      await createChat.mutateAsync({
        subject,
      });
      return;
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
      activeChatId: chatId,
    };
  }, [
    addMessage,
    messages,
    beingStreamedMessage,
    displayWelcome,
    paywallOpen,
    existingChatQuery.data,
    existingChatQuery.isLoading,
    submitSubject,
    chatId,
  ]);
  return memoizedValue;
};

export default useChat;
