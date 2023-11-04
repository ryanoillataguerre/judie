import React, { useContext, useState } from "react";
import {
  Box,
  Tag,
  TagLabel,
  useColorModeValue,
  Collapse,
  useToast,
} from "@chakra-ui/react";
import { getTopicEmoji } from "@judie/utils/topicEmoji";
import { ChatContext } from "@judie/hooks/useChat";
import { useMutation } from "react-query";
import { putChatMutation } from "@judie/data/mutations";
import { ChatMode } from "@judie/data/types/api";

const chatModes = [ChatMode.TUTOR, ChatMode.LESSON, ChatMode.PRACTICE];

const getChatModeText = (mode: ChatMode) => {
  switch (mode) {
    case ChatMode.TUTOR:
      return "Tutor (default)";
    case ChatMode.LESSON:
      return "Lesson Plan Generation";
    case ChatMode.PRACTICE:
      return "Practice Quiz Generation";
  }
};

interface SubjectModeSelectProps {
  subject: string;
}

const SubjectModeSelect = ({ subject }: SubjectModeSelectProps) => {
  const [showSelectModes, setShowSelectModes] = useState(false);

  const chatContext = useContext(ChatContext);
  const toast = useToast();

  const chatMode = chatContext.chat?.mode;
  const bgColor = useColorModeValue("gray.200", "gray.700");
  const fontColor = useColorModeValue("#000", "#FFF");
  const subjectBorderColor = useColorModeValue(
    "rgba(60, 20, 120, 0.80)",
    "whiteAlpha.300"
  );

  const updateMode = useMutation({
    mutationFn: putChatMutation,
    onSuccess: () => {
      chatContext.existingChatQuery.refetch();
      toast({
        title: "Chat mode updated!",
        description: `Chat mode updated`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubjectClick = () => {
    setShowSelectModes(!showSelectModes);
  };

  const handleSelectModeClick = (mode: ChatMode) => {
    console.log(mode);
    updateMode.mutate({
      chatId: chatContext.chat?.id!,
      mode,
    });
    setShowSelectModes(!showSelectModes);
  };

  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      position={"sticky"}
      alignItems={"center"}
      gap={"8px"}
      top={0}
      mx={"auto"}
      my={"30px"}
    >
      <Box maxH={"40px"}>
        <Tag
          as={"div"}
          size={"xl"}
          variant={"solid"}
          bg={bgColor}
          borderRadius="full"
          width={"fit-content"}
          px={"20px"}
          py={"10px"}
          border={"1px solid"}
          borderColor={subjectBorderColor}
          zIndex={1}
          color={fontColor}
          onClick={handleSubjectClick}
          _hover={{
            cursor: "pointer",
            bg: useColorModeValue("gray.300", "gray.600"),
          }}
        >
          <TagLabel>
            {`${getTopicEmoji(subject)} ${subject}`} | {chatMode}
          </TagLabel>
        </Tag>
        <Collapse in={showSelectModes} animateOpacity>
          <Box display={"Flex"} flexDir={"column"} alignItems={"center"}>
            {chatModes.map((key, idx) => (
              <Tag
                as={"div"}
                size={"lg"}
                w={"90%"}
                variant={"solid"}
                bg={bgColor}
                borderRadius="full"
                px={"16px"}
                py={"8px"}
                border={"1px solid"}
                textAlign={"center"}
                borderColor={subjectBorderColor}
                zIndex={1}
                color={fontColor}
                onClick={() => handleSelectModeClick(chatModes[idx])}
                _hover={{
                  cursor: "pointer",
                  bg: useColorModeValue("gray.300", "gray.600"),
                }}
              >
                <TagLabel w={"100%"}>{getChatModeText(key)}</TagLabel>
              </Tag>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default SubjectModeSelect;
