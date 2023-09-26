import {
  Box,
  Flex,
  InputGroup,
  useBreakpointValue,
  useColorModeValue,
  Textarea,
  useToast,
  Text,
  ToastPosition,
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
import { useAudioRecorder } from "react-audio-voice-recorder";
import { LiveAudioVisualizer } from "react-audio-visualize";
import AssignmentUploader from "../AssignmentUploader";
import useResizeTextArea from "@judie/hooks/useResizeTextArea";
import * as gtag from "@judie/utils/gtag";
import SendButton from "./SendButton";
import RecordButton from "./RecordButton";

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
