import { Box, Flex } from "@chakra-ui/react";
// import { useChatContext } from "@judie/data/contexts/ChatContext";

const Chat = ({
  chatId,
  initialQuery,
}: {
  chatId?: string;
  initialQuery?: string;
}) => {
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
