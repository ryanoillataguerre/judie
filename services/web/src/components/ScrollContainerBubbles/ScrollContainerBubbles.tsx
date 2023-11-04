import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ChatContext } from "@judie/hooks/useChat";
import { useContext } from "react";
import SubjectModeSelect from "../SubjectModeSelect/SubjectModeSelect";

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
        overflow: "auto",
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
        {subject && <SubjectModeSelect subject={subject} />}
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
