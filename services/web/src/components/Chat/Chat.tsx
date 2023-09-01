import {
  FormEvent,
  memo,
  use,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { ChatContext, UIMessageType } from "@judie/hooks/useChat";
import SubjectSelector from "../SubjectSelector/SubjectSelector";
import MessageRowBubble from "../MessageRowBubble/MessageRowBubble";
import { MessageType } from "@judie/data/types/api";
import ScrollContainerBubbles from "../ScrollContainerBubbles/ScrollContainerBubbles";
import Paywall from "../Paywall/Paywall";
import { useRouter } from "next/router";
import Loading from "../lottie/Loading/Loading";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { useMutation, useQuery } from "react-query";
import { uploadAssignmentMutation } from "@judie/data/mutations";
import ChatFooter from "@judie/components/ChatFooter/ChatFooter";
import SidebarChatNav from "../SidebarChatNav/SidebarChatNav";

const Chat = ({ initialQuery }: { initialQuery?: string }) => {
  const {
    tempUserMessageChatId,
    beingStreamedChatId,
    chat,
    streaming,
    submitSubject,
    messages,
    beingStreamedMessage,
    tempUserMessage,
    setTempUserMessage,
    paywallOpen,
    setPaywallOpen,
    displayWelcome,
  } = useContext(ChatContext);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const chatId = router.query.id;

  const scroll = () => {
    const offsetHeight = scrollContainerRef.current?.offsetHeight || 0;
    const scrollHeight = scrollContainerRef.current?.scrollHeight || 0;
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      scrollContainerRef.current?.scrollTo(0, scrollHeight);
    }
  };
  const subjectSelectorWidth = useBreakpointValue({
    base: "80%",
    md: "50%",
  });
  useEffect(() => {
    scroll();
    setTempUserMessage(undefined);
  }, [setTempUserMessage]);
  useEffect(() => {
    scroll();
  }, [messages, tempUserMessage, beingStreamedMessage]);

  const existingChatQuery = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    queryFn: () => getChatByIdQuery(chatId as string),
  });
  const renderedMessages = useMemo(() => {
    let newMessages: UIMessageType[] = messages;
    if (streaming && beingStreamedChatId === chatId) {
      if (tempUserMessage && tempUserMessageChatId === chatId) {
        newMessages = [...newMessages, tempUserMessage];
      }
    }
    return newMessages.map((message) => {
      const key = `${message.type}-${
        message.readableContent?.slice(0, 9).includes("undefined")
          ? message.readableContent?.slice(9, 50)
          : message.readableContent?.slice(0, 50)
      }`;
      return <MessageRowBubble key={key} message={message} />;
    });
  }, [
    messages,
    tempUserMessage,
    streaming,
    chatId,
    tempUserMessageChatId,
    existingChatQuery.isLoading,
  ]);

  const [animatedEllipsisStringValue, setAnimatedEllipsisStringValue] =
    useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedEllipsisStringValue((prev) => {
        if (prev.length === 3) {
          return ".";
        } else {
          return prev + ".";
        }
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      style={{
        height: "100%",
        flexDirection: "row",

        scrollPadding: "10rem",
      }}
      w={"100%"}
    >
      <SidebarChatNav />
      <Flex align={"center"} justify={"center"} w={"100%"} h={"100%"}>
        <Paywall isOpen={paywallOpen ?? false} setIsOpen={setPaywallOpen} />
        {displayWelcome ? (
          existingChatQuery?.isLoading ? (
            <Spinner color={"blue.300"} size={"lg"} />
          ) : (
            <VStack
              style={{
                width: subjectSelectorWidth,
                padding: "2rem",
                border: "#565555 0.5px solid",
                borderRadius: "0.8rem",
                alignItems: "flex-start",
              }}
              boxShadow={"sm"}
            >
              {!chat?.subject ? (
                <Flex flexGrow={1} width={"100%"}>
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
                    You can change your subject until you send your first
                    message
                  </Text>
                </Flex>
              )}
              <SubjectSelector width={"100%"} selectSubject={submitSubject} />
            </VStack>
          )
        ) : existingChatQuery.isLoading ? (
          <Flex
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner colorScheme="blue.400" />
          </Flex>
        ) : (
          <ScrollContainerBubbles>
            {renderedMessages}
            {(streaming ||
              (beingStreamedChatId === chatId && beingStreamedMessage)) && (
              <MessageRowBubble
                key={`${MessageType.BOT}-mostRecent`}
                beingStreamed={true}
                message={{
                  type: MessageType.BOT,
                  readableContent:
                    beingStreamedMessage?.slice(9, -1) ||
                    animatedEllipsisStringValue,
                  createdAt: new Date(),
                }}
              />
            )}
            <ChatFooter />
          </ScrollContainerBubbles>
        )}
      </Flex>
    </Flex>
  );
};

export default Chat;
