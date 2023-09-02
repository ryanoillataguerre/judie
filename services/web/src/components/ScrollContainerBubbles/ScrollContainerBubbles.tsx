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

import SidebarChatNav from "@judie/components/SidebarChatNav/SidebarChatNav";
import ChatFooter from "@judie/components/ChatFooter/ChatFooter";

const ScrollContainerBubbles = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const outerDiv = useRef<HTMLDivElement>(null);
  const innerDiv = useRef<HTMLDivElement>(null);

  const [prevInnerDivHeight, setPrevInnerDivHeight] = useState<number | null>(
    null
  );

  const chatContext = useContext(ChatContext);
  const subject = chatContext.chat?.subject;
  const bgColor = useColorModeValue("#FFF", "#333");
  const fontColor = useColorModeValue("#000", "#FFF");

  // const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight || 0;
    const innerDivHeight = innerDiv?.current?.clientHeight || 0;
    const outerDivScrollTop = outerDiv?.current?.scrollTop || 0;

    if (
      !prevInnerDivHeight ||
      outerDivScrollTop === prevInnerDivHeight - outerDivHeight
    ) {
      outerDiv?.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: prevInnerDivHeight ? "smooth" : "auto",
      });
    } else {
      // setShowScrollButton(true);
    }

    setPrevInnerDivHeight(innerDivHeight);
  }, [children, prevInnerDivHeight, outerDiv, innerDiv]);

  const handleScrollButtonClick = useCallback(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;

    outerDiv?.current?.scrollTo({
      top: innerDivHeight! - outerDivHeight!,
      left: 0,
      behavior: "smooth",
    });

    // setShowScrollButton(false);
  }, []);

  return (
    <Box
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
      display={"flex"}
      flexDirection={"row"}
    >
      <Box
        ref={outerDiv}
        style={{
          position: "relative",
          height: "100%",
          overflow: "scroll",
        }}
        flexGrow={1}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          ref={innerDiv}
          style={{
            position: "relative",
            paddingBottom: "0rem",
          }}
          mx={"auto"}
          width={"100%"}
          h={"100%"}
          maxW={"860px"}
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          {subject && (
            <Tag
              size={"xl"}
              variant={"solid"}
              bg={bgColor}
              borderRadius="full"
              width={"fit-content"}
              mx={"auto"}
              px={"20px"}
              py={"10px"}
              border={"1px solid"}
              borderColor={"rgba(60, 20, 120, 0.80)"}
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
        </Box>
      </Box>
      {/* {showScrollButton && (
            <Box display={"flex"} w="100%" position={"absolute"} bottom="10rem" justifyContent={"center"} alignItems={"center"}>
                <Button alignSelf={"center"} colorScheme="teal" onClick={handleScrollButtonClick}>Scroll to bottom</Button>
            </Box>
        )} */}
    </Box>
  );
};

export default ScrollContainerBubbles;
