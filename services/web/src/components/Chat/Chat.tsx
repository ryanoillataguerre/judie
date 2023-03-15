import { completionFromQueryMutation } from "@judie/data/mutations";
import { useMutation } from "react-query";
import styles from "./Chat.module.scss";
import { FormEventHandler, useState } from "react";

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

  const [chatValue, setChatValue] = useState<string>(initialQuery || "");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("onSubmit", chatValue);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.conversationContainer}></div>
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
