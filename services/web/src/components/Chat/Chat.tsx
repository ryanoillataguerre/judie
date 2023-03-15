import { completionFromQueryMutation } from "@judie/data/mutations";
import { useMutation } from "react-query";
import styles from "./Chat.module.scss";
import { FormEventHandler, useEffect, useState } from "react";
import MessageRow, { Message, MessageType } from "../MessageRow/MessageRow";
import { useRouter } from "next/router";

interface ChatProps {
  initialQuery?: string;
}

const Chat = ({ initialQuery }: ChatProps) => {
  const {
    isLoading,
    data: completionMutationData,
    isError,
  } = useMutation({
    mutationFn: completionFromQueryMutation,
  });

  const messages: Message[] = [
    {
      text: "Hello, how can I help you?",
      type: MessageType.BOT,
    },
    {
      text: "What is the square root of 16?",
      type: MessageType.USER,
    },
    {
      text: "4",
      type: MessageType.BOT,
    },
    {
      text: "What is the square root of 25?",
      type: MessageType.USER,
    },
    {
      text: "5",
      type: MessageType.BOT,
    },
  ];

  const [chatValue, setChatValue] = useState<string>(initialQuery || "");

  const router = useRouter();

  useEffect(() => {
    if (chatValue.length > 0) {
      // Remove query param
      router.replace(router.pathname, undefined, { shallow: true });
    }
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("onSubmit", chatValue);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.conversationContainer}>
        {messages.map((message, index) => (
          <MessageRow key={index} message={message} />
        ))}
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
