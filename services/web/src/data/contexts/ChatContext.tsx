import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Message } from "../types/api";

interface IChatContext {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  showMessages: boolean;
}
const ChatContext = createContext<IChatContext>({
  messages: [],
  addMessage: () => {},
  setMessages: () => {},
  showMessages: false,
});

const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessages, setShowMessages] = useState(false);

  const addMessage = useCallback(
    (message: Partial<Message>) => {
      setMessages((messages) => [...messages, message as Message]);
    },
    [messages, setMessages]
  );

  const providerValue = useMemo<IChatContext>(() => {
    return {
      messages,
      addMessage,
      setMessages,
      showMessages,
    };
  }, [messages, addMessage, setMessages, showMessages]);
  return (
    <ChatContext.Provider value={providerValue}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext, useChatContext };
