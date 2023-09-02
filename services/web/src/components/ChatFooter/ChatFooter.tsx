import {
  Button,
  Box,
  Flex,
  InputGroup,
  useBreakpointValue,
  useColorModeValue,
  Textarea,
  useToast,
  Text,
  ToastPosition,
  HStack,
  chakra,
  shouldForwardProp,
  Spinner,
} from "@chakra-ui/react";
import { ChatContext } from "@judie/hooks/useChat";
import {
  FormEvent,
  useCallback,
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { BiMicrophone } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { motion, isValidMotionProp } from "framer-motion";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { useMutation } from "react-query";
import { whisperTranscribeMutation } from "@judie/data/mutations";
import AssignmentUploader from "../AssignmentUploader";
import useResizeTextArea from "@judie/hooks/useResizeTextArea";

const SendButton = () => {
  const sendColor = useColorModeValue("black", "white");

  return (
    <Button
      type="submit"
      style={{
        padding: "0 0",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      _hover={{
        backgroundColor: "brand.secondary",
        svg: {
          fill: "white",
        },
      }}
      border={"none"}
      bg={"transparent"}
    >
      <BsSend fill={sendColor} size={20} />
    </Button>
  );
};

const ChakraCircle = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const RecordButton = ({
  onFinishRecording,
  setIsRecording,
}: {
  onFinishRecording: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
}) => {
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    recordingTime,
  } = useAudioRecorder({
    echoCancellation: true,
    noiseSuppression: true,
  });

  const transcribeMutation = useMutation({
    mutationFn: whisperTranscribeMutation,
    onSuccess: (data) => {
      onFinishRecording(data.transcript);
    },
  });

  useEffect(() => {
    if (!recordingBlob) return;
    const formData = new FormData();
    formData.append("audio", recordingBlob);
    // Send formData with mutation
    transcribeMutation.mutate({
      data: formData,
    });
  }, [recordingBlob, transcribeMutation.mutate]);

  useEffect(() => {
    setIsRecording(isRecording);
  }, [isRecording]);

  // If recording for 1 min, stop recording and send
  useEffect(() => {
    if (recordingTime >= 60) {
      stopRecording();
    }
  }, [recordingTime]);

  const micColor = useColorModeValue("black", "white");

  const buttonContent = useMemo(() => {
    if (isRecording) {
      return (
        <ChakraCircle
          animate={{
            scale: [1, 1.3, 1],
          }}
          // @ts-ignore no problem in operation, although type error appears.
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          borderRadius={"50%"}
          padding="2"
          bg={"red.400"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="1rem"
          height="1rem"
        ></ChakraCircle>
      );
    }
    if (transcribeMutation.isLoading) {
      return <Spinner color={"teal.300"} size={"sm"} />;
    }
    return <BiMicrophone fill={micColor} size={20} />;
  }, [isRecording, transcribeMutation.isLoading, micColor]);

  return (
    <Button
      type="button"
      // variant="outline"
      // colorScheme="teal"
      bg={"transparent"}
      style={{
        padding: "0 0rem",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      _hover={{
        backgroundColor: "brand.secondary",
        svg: {
          fill: "white",
        },
      }}
      border={"none"}
      onClick={() => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }}
    >
      {buttonContent}
    </Button>
  );
};

const ChatInput = () => {
  const { addMessage, chat, messages } = useContext(ChatContext);
  const [chatValue, setChatValue] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);

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

  useResizeTextArea(ref.current, chatValue);

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
        {/* <LightMode> */}
        {!messages.length && <AssignmentUploader />}
        {/* <HStack spacing={4} width={"100%"}>
          <Textarea
            onKeyUp={onKeyUp}
            autoFocus={chat?.subject ? true : false}
            ref={ref}
            value={chatValue}
            _hover={{
              borderColor: "teal",
            }}
            disabled={isRecording}
            onChange={(e) => setChatValue(e.target.value)}
            placeholder="Ask Judie anything..."
            style={{
              width: "100%",
              padding: "auto 6rem auto 0",
              backgroundColor: bgColor,
              resize: "none",
            }}
          />
          <VStack height={"100%"}>
            <SendButton />
            <RecordButton
              setIsRecording={setIsRecording}
              onFinishRecording={(text) =>
                setChatValue((prev) =>
                  prev.length ? [prev, text].join("\n") : text
                )
              }
            />
          </VStack>
        </HStack> */}
        <Box
          position={"relative"}
          display={"flex"}
          width={"100%"}
          h={"auto"}
          mb={"40px"}
          alignItems={"center"}
        >
          <Textarea
            onKeyUp={onKeyUp}
            autoFocus={chat?.subject ? true : false}
            ref={ref}
            value={chatValue}
            _hover={{
              borderColor: "brand.primary",
            }}
            disabled={isRecording}
            onChange={(e) => setChatValue(e.target.value)}
            placeholder="Ask Judie anything..."
            pr={"7rem"}
            py={"12px"}
            resize={"none"}
            bg={bgColor}
            w={"100%"}
            minH={"100%"}
            maxH={"10rem"}
            borderRadius={"24px"}
            rows={1}
            fontSize={"18px"}
          />
          <HStack
            position={"absolute"}
            bottom={"10px"}
            right={"16px"}
            height={"30px"}
            zIndex={2}
            display={"flex"}
            justifyContent={"center"}
          >
            <RecordButton
              setIsRecording={setIsRecording}
              onFinishRecording={(text) =>
                setChatValue((prev) =>
                  prev.length ? [prev, text].join("\n") : text
                )
              }
            />
            <SendButton />
          </HStack>
        </Box>
        {/* </LightMode> */}
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
    // "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 1.0) 90%)",
    "linear-gradient(#F6F6F600 0%, #F6F6F6DD 60%, #F6F6F6FF 90%)",
    // "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(52, 53, 65, 0.1) 20%, rgba(52, 53, 65, 0.2) 30%, rgba(52, 53, 65, 0.6) 40%, rgba(52, 53, 65, 0.8) 80%, rgba(52, 53, 65, 1.0) 90%)"
    "linear-gradient(#25252500 0%, #252525DD 60%, #252525FF 90%)"
  );

  return (
    <Flex
      style={{
        width: "100%",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "sticky",
        bottom: "0px",
        left: 0,
        backgroundImage: gradientColor,
      }}
      pb={"0px"}
      mt={6}
      pt={0}
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
