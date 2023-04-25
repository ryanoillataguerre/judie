import { useQuery } from "react-query";
import styles from "./Chats.module.scss";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  CloseButton,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { MessageType } from "@judie/data/types/api";
import { ChatResponse } from "@judie/data/mutations";

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
  const getTitleForChat = (chat: ChatResponse) => {
    if (chat.messages?.[0]?.content) {
      if (chat.messages?.[0]?.type !== MessageType.SYSTEM) {
        return chat.messages?.[0]?.content.slice(0, 100) + "...";
      }
    }
    return "Untitled Chat";
  };

  return (
    <div className={styles.chatsPageContainer}>
      {!seenAlert && (
        <Alert
          status="warning"
          width={"100%"}
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
          <h2 className={styles.chatTitle}>{getTitleForChat(chat)}</h2>
          <Badge
            variant={"subtle"}
            colorScheme={chat.subject ? "green" : "gray"}
          >
            {chat.subject ? chat.subject : "No subject selected"}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default Chats;
