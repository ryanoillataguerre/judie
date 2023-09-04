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
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  Spacer,
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
import {
  GET_CHAT_BY_ID,
  GET_USER_FOLDERS,
  getChatByIdQuery,
  getUserFoldersQuery,
} from "@judie/data/queries";
import { useMutation, useQuery } from "react-query";
import {
  putChatMutation,
  uploadAssignmentMutation,
} from "@judie/data/mutations";
import ChatFooter from "@judie/components/ChatFooter/ChatFooter";
import SidebarChatNav from "../SidebarChatNav/SidebarChatNav";
import AgeModal from "../AgeModal";
import { BsArrowLeft } from "react-icons/bs";
import { FiFolderPlus } from "react-icons/fi";
import useAuth from "@judie/hooks/useAuth";

const AddToFolderModal = ({
  chatId,
  existingFolderId,
  isOpen,
  onClose,
}: {
  chatId?: string;
  existingFolderId?: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const auth = useAuth();
  const toast = useToast();
  const foldersQuery = useQuery({
    queryKey: [GET_USER_FOLDERS, auth?.userData?.id],
    queryFn: getUserFoldersQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });

  const setChatFolder = useMutation({
    mutationFn: putChatMutation,
    onSuccess: () => {
      onClose();
    },
  });

  const existingFolder = foldersQuery.data?.find((folder) => {
    return folder.id === existingFolderId;
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />
      <ModalContent py={8}>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text variant={"title"}>
            {!!existingFolderId
              ? "Change this chat's folder"
              : "Add this chat to a folder"}
          </Text>
          {/* Selector for which folder to use, on change set folderId */}
          <Select
            my={"1rem"}
            placeholder={existingFolder?.userTitle || "Select a folder"}
            onChange={(e: FormEvent<HTMLSelectElement>) => {
              console.log("folderId", e.currentTarget.value);
              if (chatId) {
                setChatFolder.mutate({
                  chatId,
                  folderId: e.currentTarget.value,
                });
              } else {
                toast({
                  title: "Error adding chat to folder",
                  description: "Sorry, there was an error adding this chat",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                });
              }
            }}
          >
            {foldersQuery.data?.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.userTitle}
              </option>
            ))}
          </Select>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const AddToFolderButton = ({
  chatId,
  existingFolderId,
}: {
  chatId?: string;
  existingFolderId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AddToFolderModal
        chatId={chatId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        existingFolderId={existingFolderId}
      />
      <Button
        variant={"ghost"}
        borderRadius={"0.5rem"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={"0.25rem"}
        type={"button"}
        onClick={() => setIsOpen(true)}
      >
        <FiFolderPlus size={24} />
        <Text variant={"tinyTitle"}>
          {!!existingFolderId ? "Change folder" : "Add to folder"}
        </Text>
      </Button>
    </>
  );
};

const ChatHeader = ({
  id,
  title,
  folderId,
}: {
  id?: string;
  title?: string;
  folderId?: string;
}) => {
  const router = useRouter();
  return (
    <VStack w={"100%"}>
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        padding={"2rem 2rem 1rem 2rem"}
        width={"100%"}
      >
        <HStack paddingRight={"1rem"}>
          <BsArrowLeft
            size={20}
            style={{
              margin: "0 1rem",
            }}
            onClick={() => router.back()}
            cursor={"pointer"}
          />
          <Text variant={"subheader"}>{title}</Text>
        </HStack>
        <AddToFolderButton chatId={id} existingFolderId={folderId} />
      </HStack>
      <Box w={"95%"} borderBottom={"1px solid rgba(0, 0, 0, 0.10)"} />
    </VStack>
  );
};

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

  // console.log("title", chat?.userTitle);
  return (
    <VStack h={"100%"} w={"100%"} spacing={0}>
      <ChatHeader
        id={chat?.id}
        title={chat?.userTitle || chat?.subject}
        folderId={chat?.folder?.id}
      />
      <Flex
        style={{
          height: "100%",
          flexDirection: "row",
          scrollPadding: "10rem",
        }}
        w={"100%"}
      >
        <AgeModal />
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
              <Flex
                id="FFF"
                direction={"column"}
                justify={"flex-start"}
                justifySelf={"flex-start"}
              >
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
              </Flex>
              <Spacer />
              <ChatFooter />
            </ScrollContainerBubbles>
          )}
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Chat;
