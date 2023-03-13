import { useState } from "react";
import Input from "../Input/Input";
import styles from "./ChatBox.module.scss";

const ChatBox = () => {
  const [query, setQuery] = useState<string>("");

  const onSubmit = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className={styles.chatContainer}>
      <Input
        // className={styles.chatBoxInput}
        placeholder="What is the difference between mitosis and meiosis?"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        value={query}
      />
    </div>
  );
};

export default ChatBox;
