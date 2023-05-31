import { Button, Box, Flex, Input, InputGroup, InputRightElement, LightMode, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import useChat from "@judie/hooks/useChat";
import { FormEvent,useCallback, useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";

const SendButton = () => {
  return (
    <Button
      type="submit"
      colorScheme="teal"
      style={{
        padding: "0 0.5rem",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "0 0.5rem 0.5rem 0",
      }}
    >
      <BsSend fill={"white"} size={18} />
    </Button>
  )
}
const ChatInput = () => {
  const { addMessage, chat} = useChat();
  const [chatValue, setChatValue] = useState<string>("")
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMessage(chatValue);
    setChatValue("");
  }, [addMessage, setChatValue, chatValue])

  // Autofocus the input once a user has set a subject
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && chat?.subject) {
      ref.current.focus();
    }
  }, [chat?.subject, ref]);

  const bgColor = useColorModeValue(
    "#FFFFFF",
    "#202123",
  );
  return (
    <form onSubmit={onSubmit}>
    <InputGroup>
    <LightMode>
    <Input
    autoFocus={chat?.subject ? true : false}
    ref={ref}
    value={chatValue}
    _hover={{
      borderColor: "teal",
    }}
    onChange={(e) => setChatValue(e.target.value)}
      placeholder="Ask Judie anything..."
      style={{
        width: "100%",
        padding: "auto 2rem auto auto",
        backgroundColor: bgColor,
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
    'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(209, 231, 228, 0.1) 20%, rgba(209, 231, 228, 0.2) 30%, rgba(209, 231, 228, 0.6) 40%, rgba(209, 231, 228, 0.8) 80%, rgba(209, 231, 228, 1.0) 95%)',
    'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(52, 53, 65, 0.1) 20%, rgba(52, 53, 65, 0.2) 30%, rgba(52, 53, 65, 0.6) 40%, rgba(52, 53, 65, 0.8) 80%, rgba(52, 53, 65, 1.0) 90%)',
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
        paddingTop: '5rem',
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
