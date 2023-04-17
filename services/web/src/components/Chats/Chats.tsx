import { useQuery } from "react-query";
import styles from "./Chats.module.scss";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { useRouter } from "next/router";

const Chats = () => {
  const { data } = useQuery(GET_USER_CHATS, {
    queryFn: getUserChatsQuery,
    staleTime: 30000,
  });

  const router = useRouter();
  const onClickChat = (id: string) => {
    router.push(`/chat/${id}`);
  };
  return (
    <div className={styles.chatsPageContainer}>
      <h1 className={styles.title}>Past Chats</h1>
      {/* TODO: Learn More */}
      {data?.map((chat) => (
        <div
          key={chat.id}
          className={styles.chatContainer}
          onClick={() => onClickChat(chat.id)}
        >
          {/* TODO: Make this title use job-generated chat title */}
          <h2 className={styles.chatTitle}>
            Chat from {new Date(chat.updatedAt).toLocaleString()}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default Chats;
