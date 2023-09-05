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
  chakra,
  shouldForwardProp,
  Spinner,
  ResponsiveValue,
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
import MicIcon from "@judie/components/icons/MicIcon";
import SendIcon from "@judie/components/icons/SendIcon";
import { motion, isValidMotionProp } from "framer-motion";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { useMutation } from "react-query";
import { whisperTranscribeMutation } from "@judie/data/mutations";
import AssignmentUploader from "../AssignmentUploader";
import useResizeTextArea from "@judie/hooks/useResizeTextArea";

const SendButton = () => {
  const sendColor = useColorModeValue("gray.800", "gray.300");

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
          fill: "gray.200",
        },
      }}
      border={"none"}
      bg={"transparent"}
    >
      <SendIcon color={sendColor} boxSize={6} />
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

  const micColor = useColorModeValue("gray.800", "gray.300");

  const buttonContent = useMemo(() => {
    if (isRecording) {
      return (
        <ChakraCircle
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={
            {
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            } as ResponsiveValue<any> | undefined
          }
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
    return <MicIcon color={micColor} boxSize={6} />;
  }, [isRecording, transcribeMutation.isLoading, micColor]);

  return (
    <Button
      type="button"
      // variant="outline"
      // colorScheme="teal"
      bg={"transparent"}
      style={{
        height: "fit-content",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      px={1.5}
      py={3}
      _hover={{
        backgroundColor: "brand.secondary",
        svg: {
          stroke: "gray.200",
        },
      }}
      borderRadius={"10px"}
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

const ChatFooter = () => {
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
  const bgColorOuter = useColorModeValue("gray.200", "gray.700");

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
    <Box
      as={"form"}
      style={{
        height: "auto",
        position: "sticky",
        bottom: "0px",
        left: 0,
      }}
      w={{ base: "90%", md: "90%" }}
      px={2.5}
      py={3}
      m={"auto"}
      borderRadius={"10px"}
      bg={bgColorOuter}
      onSubmit={onSubmit}
    >
      <InputGroup>
        {!messages.length && <AssignmentUploader />}
        <Box
          position={"relative"}
          display={"flex"}
          width={"100%"}
          h={"auto"}
          alignItems={"flex-end"}
          justifyContent={"center"}
          gap={2.5}
        >
          <RecordButton
            setIsRecording={setIsRecording}
            onFinishRecording={(text) =>
              setChatValue((prev) =>
                prev.length ? [prev, text].join("\n") : text
              )
            }
          />
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
            py={"12px"}
            resize={"none"}
            bg={bgColor}
            w={"100%"}
            minH={"100%"}
            maxH={"10rem"}
            borderRadius={"24px"}
            rows={1}
            fontSize={{ base: "16px", md: "18px" }}
            flex={1}
          />
          <SendButton />
        </Box>
      </InputGroup>
    </Box>
  );
};

export default ChatFooter;
