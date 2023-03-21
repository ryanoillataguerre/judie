import styles from "./MessageRow.module.scss";
import { JudieMessage, JudieMessageType } from "@services/types";

const MessageRow = ({ message }: { message: JudieMessage }) => {
  return (
    <div
      className={[
        styles.messageRow,
        message.type === JudieMessageType.BOT
          ? styles.messageRowLeft
          : styles.messageRowRight,
      ].join(" ")}
    >
      <div className={styles.messageContainer}>
        <p>{message.readableContent}</p>
      </div>
    </div>
  );
};

export default MessageRow;
