import { useState } from "react";
import Input from "../Input/Input";
import styles from "./ChatBox.module.scss";

interface ChatBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const ChatBox = ({ onChange }: ChatBoxProps) => {
  return (
    <div className={styles.chatContainer}>
      <Input
        name={"chat"}
        placeholder="What is the difference between mitosis and meiosis?"
        onChange={onChange}
      />
    </div>
  );
};

export default ChatBox;
