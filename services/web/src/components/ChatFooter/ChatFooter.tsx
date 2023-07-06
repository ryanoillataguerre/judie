import {
  Button,
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  LightMode,
  useBreakpointValue,
  useColorModeValue,
  Textarea,
  useToast,
  Text,
  ToastPosition,
  HStack,
} from "@chakra-ui/react";
import { ChatContext } from "@judie/hooks/useChat";
import {
  FormEvent,
  useCallback,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { BsSend, BsShift } from "react-icons/bs";

const SendButton = () => {
  return (
    <Button
      type="submit"
      colorScheme="teal"
      style={{
        padding: "0 0.5rem",
        height: "99%", // 100% extends a LITTLE over the bottom of the textArea
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "0.5rem",
      }}
    >
      <BsSend fill={"white"} size={18} />
    </Button>
  );
};
const ChatInput = () => {
  const { addMessage, chat } = useContext(ChatContext);
  const [chatValue, setChatValue] = useState<string>("");
  const onSubmit = useCallback(
    (
      e: FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      addMessage(chatValue);
      setChatValue("");
    },
    [addMessage, setChatValue, chatValue]
  );

  // Autofocus the input once a user has set a subject
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current && chat?.subject) {
      ref.current.focus();
    }
  }, [chat?.subject, ref]);

  const bgColor = useColorModeValue("#FFFFFF", "#202123");

  const toastPosition = useBreakpointValue(
    {
      base: "top-left" as ToastPosition,
      md: "bottom-left" as ToastPosition,
    },
    {
      fallback: "top-left" as ToastPosition,
    }
  );
  const toast = useToast();
  const [shiftPressedRecently, setShiftPressedRecently] =
    useState<boolean>(false);
  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        if (!shiftPressedRecently) {
          toast({
            title: (
              <Flex direction={"row"} alignItems={"center"} gap={2}>
                <Text>Press only </Text>
                <AiOutlineEnter />
                <Text> to submit</Text>
              </Flex>
            ),
            status: "info",
            duration: 4000,
            isClosable: true,
            position: toastPosition,
          });
          setShiftPressedRecently(true);
        }
        setTimeout(() => {
          setShiftPressedRecently(false);
        }, 15000);
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    },
    [
      onSubmit,
      toast,
      shiftPressedRecently,
      setShiftPressedRecently,
      toastPosition,
    ]
  );

  return (
    <form onSubmit={onSubmit}>
      <InputGroup>
        <LightMode>
          <HStack spacing={4} width={"100%"}>
            <Textarea
              onKeyUp={onKeyUp}
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
                padding: "auto 6rem auto auto",
                backgroundColor: bgColor,
              }}
            />
            <SendButton />
          </HStack>
        </LightMode>
        {/* <InputRightElement style={{ height: "100%" }}>
          
        </InputRightElement> */}
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
    "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 1.0) 90%)",
    "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(52, 53, 65, 0.1) 20%, rgba(52, 53, 65, 0.2) 30%, rgba(52, 53, 65, 0.6) 40%, rgba(52, 53, 65, 0.8) 80%, rgba(52, 53, 65, 1.0) 90%)"
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
        paddingTop: "4rem",
        backgroundImage: gradientColor,
      }}
    >
      <Box
        style={{
          width: inputWidth,
          // height: '100%',
          // padding: "1rem"
        }}
      >
        <ChatInput />
      </Box>
    </Flex>
  );
};

export default ChatFooter;
