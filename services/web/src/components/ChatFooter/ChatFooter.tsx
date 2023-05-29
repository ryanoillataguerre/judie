import { Box, Flex, Input, InputGroup, InputRightElement, LightMode, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import useChat from "@judie/hooks/useChat";
import { FormEvent,useCallback,  FormEventHandler, useState } from "react";
import { BsSend } from "react-icons/bs";

const SendButton = () => {
  const chat = useChat()
  const fill = useColorModeValue(
    '#C0C1C4',
    '#343541'
  )
  return (
    <Box
      style={{
        padding: "0 0.5rem",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BsSend fill={fill} size={18} />
    </Box>

  )
}
const ChatInput = () => {
  const { addMessage} = useChat();
  const [chatValue, setChatValue] = useState<string>("")
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>
    ) => {
    e.preventDefault();
    addMessage(chatValue);
    setChatValue("");
  }, [addMessage])

  return (
    <form onSubmit={onSubmit}>
    <InputGroup>
    <LightMode>
    <Input
    value={chatValue}
    onChange={(e) => setChatValue(e.target.value)}
      colorScheme="white"
      placeholder="Ask Judie anything..."
      style={{
        width: "100%",
        backgroundColor: "white"
      }}
    />
    </LightMode>
    <InputRightElement>
      <SendButton />
    </InputRightElement>
    </InputGroup>
    </form>
  );
};

const ChatFooter = () => {
  const inputWidth = useBreakpointValue({
    base: "90%",
    md: "70%",
  });

  const gradientColor = useColorModeValue(
    'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(209, 231, 228, 0.1) 20%, rgba(209, 231, 228, 0.2) 30%, rgba(209, 231, 228, 0.9) 100%)',
    'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(52, 53, 65, 0.1) 20%, rgba(52, 53, 65, 0.2) 30%, rgba(52, 53, 65, 0.9) 100%)',
  );
  
  return (
    <Flex
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "10rem",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        paddingTop: '4rem',
        backgroundImage: gradientColor
      }}
      
    >
      <Box
        style={
          {
            width: inputWidth,
            // height: '100%',
            // padding: "1rem"
          }
        }
      >
        <ChatInput />
      </Box>
    </Flex>
  );
};

export default ChatFooter;
