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
import { LiveAudioVisualizer } from "react-audio-visualize";
import { useMutation } from "react-query";
import { whisperTranscribeMutation } from "@judie/data/mutations";
import AssignmentUploader from "../AssignmentUploader";
import useResizeTextArea from "@judie/hooks/useResizeTextArea";
import * as gtag from "@judie/utils/gtag";

const SendButton = () => {
  const sendColor = useColorModeValue("gray.800", "gray.300");

  return (
    <Button
      type="submit"
      alignSelf={"flex-end"}
      height={"fit-content"}
      style={{
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
      px={2.5}
      py={3}
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
  isRecording,
  recordingBlob,
  recordingTime,
  startRecording,
  stopRecording,
  onFinishRecording,
  setIsRecording,
}: {
  isRecording: boolean;
  recordingBlob: Blob | undefined;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  onFinishRecording: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
}) => {
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

  // useEffect(() => {
  //   setIsRecording(isRecording);
  // }, [isRecording, setIsRecording]);

  // If recording for 1 min, stop recording and send
  useEffect(() => {
    if (recordingTime >= 60) {
      stopRecording();
    }
  }, [recordingTime, stopRecording]);

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
        gtag.event({
          action: "click",
          category: "chat",
          label: "record",
          value: null,
        });
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
  const [isRecordings, setIsRecording] = useState<boolean>(false);

  const onSubmit = useCallback(
    (
      e: FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      addMessage(chatValue);
      setChatValue("");
      gtag.event({
        action: "submit",
        category: "chat",
        label: "chat",
        value: null,
      });
    },
    [addMessage, setChatValue, chatValue]
  );

  const widthValues = useBreakpointValue({
    base: "190px",
    md: "250px",
    lg: "250px",
  });

  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder({
    echoCancellation: true,
    noiseSuppression: true,
  });

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
  const barColors = useColorModeValue("#3C1478", "rgb(162, 115, 232)");

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
  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    },
    [onSubmit, toast, toastPosition]
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
          gap={{ base: 1.5, md: 2.5 }}
        >
          <RecordButton
            recordingBlob={recordingBlob}
            recordingTime={recordingTime}
            startRecording={startRecording}
            stopRecording={stopRecording}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onFinishRecording={(text) =>
              setChatValue((prev) =>
                prev.length ? [prev, text].join("\n") : text
              )
            }
          />
          {mediaRecorder ? (
            <Flex
              w={"100%"}
              flex={1}
              minH={"100%"}
              maxH={"10rem"}
              justify={"center"}
            >
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={widthValues}
                height={"45px"}
                barWidth={6}
                gap={2}
                barColor={barColors}
                fftSize={256}
                smoothingTimeConstant={0.8}
              />
            </Flex>
          ) : (
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
              py={{ base: "10px", md: "12px" }}
              px={{ base: "12px", md: "16px" }}
              resize={"none"}
              bg={bgColor}
              w={"100%"}
              minH={"100%"}
              maxH={"10rem"}
              borderRadius={"24px"}
              rows={1}
              fontSize={{ base: "16px", md: "18px" }}
              flex={1}
              lineHeight={{ base: "25px", md: "23px" }}
            />
          )}

          <SendButton />
        </Box>
      </InputGroup>
    </Box>
  );
};

export default ChatFooter;
