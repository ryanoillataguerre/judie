import { Dispatch, SetStateAction } from "react";
import styles from "./ChatInput.module.scss";

const ChatInput = ({
  chatValue,
  setChatValue,
}: {
  chatValue: string;
  setChatValue: Dispatch<SetStateAction<string>>;
}) => (
  <input
    placeholder={"What is mitosis?"}
    className={styles.chatBoxInput}
    onChange={(e) => setChatValue(e.target.value)}
    value={chatValue}
  />
);

export default ChatInput;
