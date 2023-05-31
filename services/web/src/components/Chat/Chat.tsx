import { memo } from "react";
import { Flex, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import useChat from "@judie/hooks/useChat";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import SubjectSelector from "../SubjectSelector/SubjectSelector";
import MessageRow from "../MessageRow/MessageRow";
import { MessageType } from "@judie/data/types/api";

const MemoizedMessageRow = memo(MessageRow, (prevProps, nextProps) => prevProps.message.readableContent === nextProps.message.readableContent);


const Chat = ({
  initialQuery,
}: {
  chatId?: string;
  initialQuery?: string;
}) => {
  const { chat, loading, submitSubject, messages, beingStreamedMessage } = useChat();
  const subjectSelectorWidth = useBreakpointValue({
    base: "100%",
    md: "50%",
  });

  return (
    <Flex
      style={{
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        scrollPadding: "10rem",
        padding: "0 3rem",
      }}
    >
      {!chat || !chat.subject ? (
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
          <Flex style={{
            flexDirection: "column",
            width: "100%",
            height: "100%",
            overflowY: "scroll",
            paddingBottom: "10rem"
          }}>
          {messages?.map((message, index) => {
            return (
              <MemoizedMessageRow index={index} key={`${message.readableContent}-${index}`} message={message} />
            )
          })}
          {beingStreamedMessage && (
            <MemoizedMessageRow
              index={messages.length}
              message={{
                type: MessageType.USER,
                readableContent: beingStreamedMessage,
                createdAt:  new Date(),
              }}
            />
          )}
          </Flex>
        )
      }
    </Flex>
  );
  // const chatContext = useChatContext();
  // return (
  //   <div className={styles.chatContainer}>
  //     <Paywall isOpen={isPaywallOpen} setIsOpen={setIsPaywallOpen} />
  //     {displayWelcome ? (
  //       <div className={styles.welcomeContainer}>
  //         <ChatWelcome selectSubject={onSelectSubject} />
  //       </div>
  //     ) : (
  //       <div className={styles.conversationContainer}>
  //         <div className={styles.reverseFlexContainer}>
  //           {messages?.map((message, index) => {
  //             if (
  //               message.type === MessageType.USER &&
  //               message.readableContent ===
  //                 mostRecentUserChat?.readableContent &&
  //               index === messages.length - 1
  //             ) {
  //               setMostRecentUserChat(undefined);
  //             }
  //             return <MessageRow key={index} message={message} />;
  //           })}
  //           {mostRecentUserChat && <MessageRow message={mostRecentUserChat} />}
  //           {beingStreamedMessage && (
  //             <MessageRow
  //               message={{
  //                 type: MessageType.BOT,
  //                 readableContent: beingStreamedMessage,
  //                 createdAt: new Date(),
  //               }}
  //             />
  //           )}
  //         </div>
  //       </div>
  //     )}
  //     <form onSubmit={onSubmit} className={styles.chatBoxContainer}>
  //       {(isLoading || loading) && (
  //         <Progress
  //           size="xs"
  //           isIndeterminate
  //           width={"100%"}
  //           colorScheme={"green"}
  //           background="transparent"
  //         />
  //       )}
  //       <ChatInput chatValue={chatValue} setChatValue={setChatValue} />
  //     </form>
  //   </div>
  // );
};

export default Chat;
