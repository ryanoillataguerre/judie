import { Dispatch, FormEventHandler, SetStateAction } from "react";
import { IoSend } from "react-icons/io5";
import styles from "./ChatInput.module.scss";

const ChatInput = ({
  chatValue,
  setChatValue,
}: {
  chatValue: string;
  setChatValue: Dispatch<SetStateAction<string>>;
}) => (
  <div className={styles.inputContainer}>
    <input
      placeholder={"Type your question here..."}
      className={styles.chatBoxInput}
      onChange={(e) => setChatValue(e.target.value)}
      value={chatValue}
    ></input>
    <button type="submit">
      <IoSend
        size={18}
        style={{
          position: "absolute",
          right: "12px",
          top: "43%",
          fill: "#0E8B8F",
        }}
      />
    </button>
  </div>
);

export default ChatInput;
