import styles from "./MessageRow.module.scss";

export interface Message {
  type: MessageType;
  text: string;
}

export enum MessageType {
  BOT = "BOT",
  USER = "USER",
}

const MessageRow = ({
  message,
}: {
  message: {
    text: string;
    type: MessageType;
  };
}) => {
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
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageRow;
