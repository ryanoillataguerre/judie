import { Flex, useColorModeValue, Text } from "@chakra-ui/react";
import useChat from "@judie/hooks/useChat";

const ChatNavbar = ({ chatId }: { chatId?: string }) => {
  const chat = useChat({ chatId });
  const bgColor = useColorModeValue("#D1E7E4", "#3E4756");
  const subject = chat.chat?.subject;
  return (
    <Flex
      style={{
        width: "100%",
        height: "3rem",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {subject && (
        <Text
          style={{
            fontSize: "0.8rem",
            fontWeight: 400,
          }}
        >
          Subject: {subject}
        </Text>
      )}
    </Flex>
  );
};

export default ChatNavbar;
