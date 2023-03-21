import { completionFromQueryMutation } from "@judie/data/mutations";
import { useMutation } from "react-query";
import styles from "./Chat.module.scss";
import { FormEventHandler, useEffect, useState } from "react";
import MessageRow from "../MessageRow/MessageRow";
import { useRouter } from "next/router";
import { JudieMessage } from "@services/types";

interface ChatProps {
  initialQuery?: string;
}

const Chat = ({ initialQuery }: ChatProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<JudieMessage[]>([]);
  const [mostRecentMessageContent, setMostRecentMessageContent] = useState("");

  const {
    isLoading,
    data: completionMutationData,
    isError,
    mutateAsync,
  } = useMutation({
    mutationFn: completionFromQueryMutation,
    onError: (error) => {
      console.log("Error getting completion", error);
    },
    onSuccess: (data) => {
      console.log("Success getting completion", data);
    },
    retry: false,
  });

  useEffect(() => {});

  // Suck query param into text box for clean path
  const [chatValue, setChatValue] = useState<string>(initialQuery || "");
  useEffect(() => {
    if (chatValue.length > 0) {
      // Remove query param
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await mutateAsync({
      query: chatValue,
      // When do we want to make a new chat? Maybe a button?
      newChat: false,
    });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.conversationContainer}>
        {messages?.map((message, index) => (
          <MessageRow key={index} message={message} />
        ))}
        {isLoading && (
          <MessageRow message={{ type: "USER", content: "Hello" }} />
        )}
      </div>
      <form onSubmit={onSubmit} className={styles.chatBoxContainer}>
        <input
          placeholder={"What is the square root of 16?"}
          className={styles.chatBoxInput}
          onChange={(e) => setChatValue(e.target.value)}
          value={chatValue}
        />
      </form>
    </div>
  );
};

export default Chat;
