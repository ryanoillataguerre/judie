import {
  Box,
  Flex,
  Tag,
  TagLabel,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatContext } from "@judie/hooks/useChat";
import { useContext } from "react";
import { getTopicEmoji } from "@judie/utils/topicEmoji";

const ScrollContainerBubbles = ({
  children,
  defaultTop,
}: {
  children: React.ReactNode;
  defaultTop?: boolean;
}) => {
  const outerDiv = useRef<HTMLDivElement>(null);
  const innerDiv = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const chatContext = useContext(ChatContext);
  const subject = chatContext.chat?.subject;
  const bgColor = useColorModeValue("gray.200", "gray.700");
  const fontColor = useColorModeValue("#000", "#FFF");
  const subjectBorderColor = useColorModeValue(
    "rgba(60, 20, 120, 0.80)",
    "whiteAlpha.300"
  );

  useEffect(() => {
    if (defaultTop) {
      topRef.current?.scrollIntoView({});
    } else {
      bottomRef.current?.scrollIntoView({});
    }
  }, [innerDiv.current?.scrollHeight, defaultTop]);

  return (
    <Box
      ref={outerDiv}
      style={{
        position: "relative",
        height: "100%",
        overflow: "scroll",
      }}
      display={"flex"}
      flexGrow={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Flex
        ref={innerDiv}
        id="FFF"
        direction={"column"}
        justify={"flex-start"}
        justifySelf={"flex-start"}
        position={"absolute"}
        h={"100%"}
        w={"100%"}
        maxW={"860px"}
        m={"auto"}
      >
        <div ref={topRef} />
        {subject && (
          <Tag
            as={"div"}
            size={"xl"}
            variant={"solid"}
            bg={bgColor}
            borderRadius="full"
            width={"fit-content"}
            mx={"auto"}
            px={"20px"}
            py={"10px"}
            border={"1px solid"}
            borderColor={subjectBorderColor}
            my={"30px"}
            position={"sticky"}
            top={0}
            zIndex={1}
            color={fontColor}
          >
            <TagLabel>{`${getTopicEmoji(subject)} ${subject}`}</TagLabel>
          </Tag>
        )}
        {children}
        <div ref={bottomRef} />
      </Flex>
      {/* {showScrollButton && (
            <Box display={"flex"} w="100%" position={"absolute"} bottom="10rem" justifyContent={"center"} alignItems={"center"}>
                <Button alignSelf={"center"} colorScheme="teal" onClick={handleScrollButtonClick}>Scroll to bottom</Button>
            </Box>
        )} */}
    </Box>
  );
};

export default ScrollContainerBubbles;
