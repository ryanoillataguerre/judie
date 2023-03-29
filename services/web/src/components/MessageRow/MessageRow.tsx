import { Message, MessageType } from "@judie/data/types/api";
import styles from "./MessageRow.module.scss";

export interface TempMessage {
  type: MessageType.BOT | MessageType.USER;
  readableContent: string;
  createdAt: Date;
}
const MessageRow = ({ message }: { message: Message | TempMessage }) => {
  return (
    <div
      className={[
        styles.messageRow,
        message.type === MessageType.BOT
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
