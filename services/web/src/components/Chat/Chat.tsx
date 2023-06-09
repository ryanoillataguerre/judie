import { memo, useContext, useEffect, useMemo, useRef } from "react";
import { Flex, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import  { ChatContext, UIMessageType } from "@judie/hooks/useChat";
import SubjectSelector from "../SubjectSelector/SubjectSelector";
import MessageRow from "../MessageRow/MessageRow";
import { MessageType } from "@judie/data/types/api";
import ScrollContainer from "../ScrollContainer/ScrollContainer";
import Paywall from "../Paywall/Paywall";

// const MessageRow = memo(MessageRow, (prevProps, nextProps) => prevProps.message.readableContent === nextProps.message.readableContent);


const Chat = ({
  initialQuery,
}: {
  chatId?: string;
  initialQuery?: string;
}) => {
  const { chat, streaming, submitSubject, messages, beingStreamedMessage, tempUserMessage, setTempUserMessage, paywallOpen, setPaywallOpen } = useContext(ChatContext);
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
    base: "80%",
    md: "50%",
  });
  useEffect(() => {
    scroll();
    setTempUserMessage(undefined);
  }, [setTempUserMessage]);
  useEffect(() => {
    scroll()
  }, [messages, tempUserMessage, beingStreamedMessage])

  const renderedMessages = useMemo(() => {
    let newMessages: UIMessageType[] = messages;
    if (streaming) {
      if (tempUserMessage) {
        newMessages = [...newMessages, tempUserMessage]
      }
      // newMessages = [...newMessages, {
      //   type: MessageType.BOT,
      //   readableContent: beingStreamedMessage,
      //   createdAt: new Date(),
      // }]
    }
    return newMessages.map((message, index) => {
      const isLast = ((index + 1) === messages.length);
      const key = `${message.type}-${isLast && message.type === MessageType.BOT ? `mostRecent` : message.readableContent?.slice(0, 9).includes("undefined") ? message.readableContent?.slice(9, 50) : message.readableContent?.slice(0, 50)}`;
      return (
        <MessageRow key={key} message={message} />
      )
    })
  }, [messages, tempUserMessage, streaming])
  

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
      <Paywall isOpen={paywallOpen ?? false} setIsOpen={setPaywallOpen}  />
      {!chat || !chat?.subject || (!chat?.messages?.length && !beingStreamedMessage && !tempUserMessage) ? (
        <VStack style={{
            width: subjectSelectorWidth,
            padding: "2rem",
            border: "#565555 0.5px solid",
            borderRadius: "0.8rem",
        }} boxShadow={"sm"}>
          {!chat?.subject ? (
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
            ) : (
              <Flex width={"100%"}>
                <Text
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    marginBottom: "0.5rem",
                  }}
                >
                  You can change your subject until you send your first message
                </Text>
              </Flex>
            )}
            <SubjectSelector
        width={"100%"}
        selectSubject={submitSubject}
      />
      </VStack>
      ) : (
          <ScrollContainer>
            {renderedMessages}
            {beingStreamedMessage && (
              <MessageRow
                key={`${MessageType.BOT}-mostRecent`}
                message={{
                  type: MessageType.BOT,
                  readableContent: beingStreamedMessage.slice(9, -1),
                  createdAt: new Date(),
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
