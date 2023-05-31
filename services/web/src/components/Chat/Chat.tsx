import { memo, useContext, useEffect, useRef } from "react";
import { Flex, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import  { ChatContext } from "@judie/hooks/useChat";
import SubjectSelector from "../SubjectSelector/SubjectSelector";
import MessageRow from "../MessageRow/MessageRow";
import { MessageType } from "@judie/data/types/api";
import ScrollContainer from "../ScrollContainer/ScrollContainer";

const MemoizedMessageRow = memo(MessageRow, (prevProps, nextProps) => `${prevProps.message?.type}-${prevProps.message?.createdAt}` === `${nextProps.message?.type}-${nextProps.message?.createdAt}`);


const Chat = ({
  initialQuery,
}: {
  chatId?: string;
  initialQuery?: string;
}) => {
  const { chat, loading, submitSubject, messages, beingStreamedMessage, tempUserMessage } = useContext(ChatContext);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    const offsetHeight = scrollContainerRef.current?.offsetHeight || 0
    const scrollHeight = scrollContainerRef.current?.scrollHeight || 0
    const scrollTop = scrollContainerRef.current?.scrollTop || 0
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      scrollContainerRef.current?.scrollTo(0, scrollHeight)
    }
  }
  const subjectSelectorWidth = useBreakpointValue({
    base: "100%",
    md: "50%",
  });
  useEffect(() => {
    scroll();
  }, []);
  useEffect(() => {
    scroll()
  }, [messages, tempUserMessage, beingStreamedMessage])

  return (
    <Flex
      style={{
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        scrollPadding: "10rem",
      }}
    >
      {!chat || !chat?.subject ? (
        <VStack style={{
            width: subjectSelectorWidth,
            padding: "2rem",
            border: "#565555 0.5px solid",
            borderRadius: "0.8rem",
        }} boxShadow={"sm"}>
      <Flex width={"100%"}>
        <Text
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          What would you like to chat about?
        </Text>
      </Flex>
      <SubjectSelector
        width={"100%"}
        selectSubject={submitSubject}
      />
      </VStack>
      ) : (
          <ScrollContainer>
          {messages?.map((message, index) => {
            return (
              <MemoizedMessageRow index={index} key={`${message.type}-${message.createdAt}`} message={message} />
            )
          })}
          {tempUserMessage && (
            <MemoizedMessageRow
              index={messages.length}
              message={tempUserMessage}
            />
          )}
          {beingStreamedMessage && (
            <MemoizedMessageRow
              index={(messages.length || 0) + (tempUserMessage ? 1 : 0)}
              message={{
                type: MessageType.BOT,
                readableContent: beingStreamedMessage,
                createdAt:  new Date(),
              }}
            />
          )}
          </ScrollContainer>
        )
      }
    </Flex>
  );
};

export default Chat;
