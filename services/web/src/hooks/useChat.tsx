import {
  ChatResponse,
  completionFromQueryMutation,
  createChatMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { GET_CHAT_BY_ID, getChatByIdQuery, getUserChatsQuery, GET_USER_CHATS } from "@judie/data/queries";
import { Message, MessageType } from "@judie/data/types/api";
import { useMutation, useQuery } from "react-query";
import useAuth from "./useAuth";
import {  useCallback, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HTTPResponseError } from "@judie/data/baseFetch";
import useStorageState from "./useStorageState";
import { useRouter } from "next/router";
import { set } from "react-hook-form";

export interface TempMessage {
  type?: MessageType.BOT | MessageType.USER;
  readableContent?: string;
  createdAt?: Date;
}

export type UIMessageType = Message | TempMessage;

interface UseChatData {
  activeChatId?: string;
  chat?: ChatResponse;
  streaming: boolean;
  addMessage: (message: string) => void;
  messages: Message[];
  beingStreamedMessage?: string;
  displayWelcome: boolean;
  paywallOpen?: boolean;
  submitSubject: (subject: string) => void;
  tempUserMessage?: TempMessage;
  setTempUserMessage: (message: TempMessage | undefined) => void;
  setPaywallOpen: (open: boolean) => void;
}

export const ChatContext = createContext<UseChatData>({
  activeChatId: undefined,
  chat: undefined,
  streaming: false,
  addMessage: () => {},
  messages: [],
  beingStreamedMessage: undefined,
  displayWelcome: true,
  paywallOpen: false,
  submitSubject: () => {},
  tempUserMessage: undefined,
  setTempUserMessage: () => {},
  setPaywallOpen: () => {},
});



export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [displayWelcome, setDisplayWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [beingStreamedMessage, setBeingStreamedMessage] = useStorageState<
    string | undefined
  >(undefined, "beingStreamedMessage");
  const [paywallOpen, setPaywallOpen] = useState<boolean>(false);
  const [tempUserMessage, setTempUserMessage] = useState<TempMessage>();
  const [streaming, setStreaming] = useState<boolean>(false);

  const chatId = useMemo(() => {
    return router.query?.id as string;
  }, [router.query]);


  useEffect(() => {
    console.log('streaming', streaming)
  }, [streaming])
  const abortController = useMemo(() => {
    return new AbortController();
  }, []);

  const [prevChatId, setPrevChatId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (beingStreamedMessage && chatId !== prevChatId) {
      console.log('firing reset hook')
      setBeingStreamedMessage(undefined);
      setTempUserMessage(undefined);
      setStreaming(false);
    }
    setPrevChatId(chatId);
  }, [chatId])

  useEffect(() => {
    const abortStream = () => {
      if (beingStreamedMessage) {
        abortController.abort();
        setBeingStreamedMessage(undefined);
        setTempUserMessage(undefined);
      }
    }
    router.events.on('routeChangeStart', abortStream);
    return () => {
      router.events.off('routeChangeStart', abortStream);
    }
}, [router, beingStreamedMessage, abortController]);

  const streamCallback = (message: string) => {
    if (message.includes(`{"error":`)) {
      return;
    }
    if (message.includes("undefined")) {
      const newMessage = message.replace("undefined", "");
      setBeingStreamedMessage((prev) => prev + newMessage);
    } else {
      setBeingStreamedMessage((prev) => prev + message);
    }
  };
  const completionMutation = useMutation({
    mutationFn: ({ query }: { query: string }): Promise<string> => {
      if (chatId) {
        setBeingStreamedMessage(undefined);
        return completionFromQueryMutation({
          query,
          chatId,
          abortController,
          setChatValue: streamCallback,
          onStreamEnd: async () => {
            console.log('stream ended')
            // auth.refresh();
            await existingChatQuery.refetch();
            setBeingStreamedMessage(undefined);
            setStreaming(false);
          },
          onError: (err: HTTPResponseError) => {
            if (err.message.includes("AbortError")) {
              toast({
                title: "Oops!",
                description: "Something went wrong changing pages, please try again.",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
            }
            if (err.response.code === 429) {
              setPaywallOpen(true);
              setTempUserMessage(undefined);
            }
          }
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
        return Promise.reject();
      }
    },
    onError: (err: HTTPResponseError) => {
      setStreaming(false);
      console.log('errResponse', err.response)
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

  // useEffect(() => {
  //   setBeingStreamedMessage(undefined);
  // }, [chatId, setBeingStreamedMessage])

  const existingChatQuery = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    enabled: !!chatId && !beingStreamedMessage?.length,
    refetchOnWindowFocus: false,
    queryFn: () => getChatByIdQuery(chatId as string),
    onSuccess: (data) => {
      if (data?.subject || data?.messages?.length > 0) {
        setDisplayWelcome(false);
      } else {
        setDisplayWelcome(true);
      }
      setMessages(data?.messages);
      if (!completionMutation.isLoading) {
        if (beingStreamedMessage) {
          setBeingStreamedMessage(undefined);
        }
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

  const addMessage = useCallback(async (prompt: string) => {
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
    if (streaming) {
      console.error("Previous message not finished")
      toast({
        title: "Please wait for the previous message to respond",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    setTempUserMessage(() => 
      ({
        type: MessageType.USER,
        readableContent: prompt,
        createdAt: new Date(),
      })
    );
    // Call mutation
    setStreaming(true);
    await completionMutation.mutateAsync({ query: prompt });
    
  }, [chatId, beingStreamedMessage, completionMutation, toast]);

  const userChatsQuery = useQuery({
    queryKey: [GET_USER_CHATS, auth.userData?.id],
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: getUserChatsQuery
  });

  // User sets a subject from the chat window
  const submitSubject = useCallback(async (subject: string) => {
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
    userChatsQuery.refetch();
  }, [chatId, createChat, putChat, existingChatQuery]);

  const providerValue = useMemo(() => {
    return {
      chat: existingChatQuery.data,
      addMessage,
      streaming,
    messages,
    beingStreamedMessage,
    displayWelcome,
    paywallOpen,
    submitSubject,
    activeChatId: chatId,
    tempUserMessage,
    setTempUserMessage,
    setPaywallOpen
    };
  }, [
      existingChatQuery.data,
      addMessage,
    messages,
    beingStreamedMessage,
    displayWelcome,
    paywallOpen,
    submitSubject,
    chatId,
    tempUserMessage,
    setTempUserMessage,
    streaming,
    setPaywallOpen
  ]);
  return (
    <ChatContext.Provider value={providerValue}>
      {children}
    </ChatContext.Provider>
  );
};
