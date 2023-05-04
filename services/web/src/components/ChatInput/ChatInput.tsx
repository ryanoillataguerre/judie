import { Dispatch, FormEventHandler, SetStateAction } from "react";
import { IoSend } from "react-icons/io5";
import styles from "./ChatInput.module.scss";
import useKeypress from "@judie/hooks/useKeyPress";

const ChatInput = ({
  chatValue,
  setChatValue,
}: {
  chatValue: string;
  setChatValue: Dispatch<SetStateAction<string>>;
}) => {
  useKeypress("Enter", (event) => {
    event.preventDefault();
    setChatValue((prevValue) => {
      return prevValue + "\n";
    });
  });
  return (
    <div
      className={styles.inputContainer}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      }}
    >
      <textarea
        tabIndex={0}
        placeholder={"Type your question here..."}
        className={styles.chatBoxInput}
        onChange={(e) => setChatValue(e.target.value)}
        value={chatValue}
      />
      <button type="submit" className={styles.submitButton}>
        <IoSend
          size={24}
          style={{
            alignSelf: "center",
            justifySelf: "center",
            zIndex: 1000,
            fill: "#FFFFFF",
          }}
        />
      </button>
    </div>
  );
};

export default ChatInput;
