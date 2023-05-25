import { Box, Flex, VStack } from "@chakra-ui/react";
import { useState } from "react";
// import { useChatContext } from "@judie/data/contexts/ChatContext";
import useChat from "@judie/hooks/useChat";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import SubjectSelector from "../SubjectSelector/SubjectSelector";

const ChatHeaderBar = ({ chatId }: { chatId?: string }) => {
  return (
    <Flex
      style={{
        width: "100%",
        height: "3rem",
      }}
    ></Flex>
  );
};

const Chat = ({
  chatId,
  initialQuery,
}: {
  chatId?: string;
  initialQuery?: string;
}) => {
  const { chat, loading, submitSubject } = useChat({ chatId });
  console.log(chat);
  if (loading) {
    return <LoadingScreen />;
  }
  if (!chat) {
    return <SubjectSelector selectSubject={submitSubject} />;
  }
  // TODO:
  // Do we display welcome?
  // - If the chat exists but has no messages yet and there's no mostRecentMessage, display welcome
  // - If the chat exists and has messages, don't display welcome
  // Populate messages based on existing chat
  //
  // onSubmit - same as before?
  return (
    <VStack>
      <ChatHeaderBar />
    </VStack>
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
