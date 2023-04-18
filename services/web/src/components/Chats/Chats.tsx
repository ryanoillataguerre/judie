import { useQuery } from "react-query";
import styles from "./Chats.module.scss";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";

const Chats = ({
  seenAlert,
  onClickDismissAlert,
}: {
  seenAlert: boolean;
  onClickDismissAlert: () => void;
}) => {
  const { data } = useQuery(GET_USER_CHATS, {
    queryFn: getUserChatsQuery,
    staleTime: 30000,
  });

  const router = useRouter();
  const onClickChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const { isOpen: isVisible, onClose } = useDisclosure({
    defaultIsOpen: !seenAlert,
    onClose: () => {
      onClickDismissAlert();
    },
  });

  return (
    <div className={styles.chatsPageContainer}>
      {!seenAlert && (
        <Alert
          status="warning"
          width={"100%"}
          height={"100%"}
          display={"flex"}
          flexDir={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={8}
          borderRadius={8}
          marginBottom={8}
        >
          <Flex height={"100%"} direction={"row"} alignItems={"center"}>
            <AlertIcon />
            <AlertTitle>Just a heads up</AlertTitle>
            <AlertDescription>
              Chats will expire after 24 hours of inactivity. You will be able
              to see a summary of your chat when you access it after that.
            </AlertDescription>
          </Flex>
          <CloseButton onClick={onClose} />
        </Alert>
      )}
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
