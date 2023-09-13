import React, { useEffect, useMemo } from "react";
import {
  Button,
  useColorModeValue,
  Spinner,
  ResponsiveValue,
  chakra,
  shouldForwardProp,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import { motion, isValidMotionProp } from "framer-motion";
import { whisperTranscribeMutation } from "@judie/data/mutations";
import MicIcon from "@judie/components/icons/MicIcon";

const ChakraCircle = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

type RecordButtonProps = {
  isRecording: boolean;
  recordingBlob: Blob | undefined;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  onFinishRecording: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
};

const RecordButton = ({
  isRecording,
  recordingBlob,
  recordingTime,
  startRecording,
  stopRecording,
  onFinishRecording,
  setIsRecording,
}: RecordButtonProps) => {
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

export default RecordButton;
