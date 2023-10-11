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
  Tag,
  TagLabel,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  subjectSectionToSubjectsMap,
  subjectSections,
} from "../../data/static/subjects";
import { ChatContext, UIMessageType } from "@judie/hooks/useChat";
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
import { getTopicEmoji } from "@judie/utils/topicEmoji";

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
    <Flex>
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
    </Flex>
  );
};

const SubjectCloud = ({
  subjects,
  onSelectSubject,
}: {
  onSelectSubject: (subject: string) => void;
  subjects: string[];
}) => {
  const { userData } = useAuth();
  // const subjectSections: string[] = useMemo(() => {
  //   if (userData?.email?.includes("@judie.io")) {
  //     return [...subjectSections, "Admin"];
  //   }
  //   return subjectSections;
  // }, [userData]);

  const bgColor = useColorModeValue("#FFF", "whiteAlpha.300");
  const tagColor = useColorModeValue(
    {
      bg: "gray.100",
    },
    {
      bg: "whiteAlpha.200",
    }
  );
  const fontColor = useColorModeValue("#000", "#FFF");
  const subjectBorderColor = useColorModeValue(
    "rgba(60, 20, 120, 0.80)",
    "whiteAlpha.300"
  );
  const [expanded, setExpanded] = useState(false);
  return (
    <Flex
      width={"100%"}
      overflowY={"auto"}
      // flexDirection={"column"}
      justifyContent={"flex-start"}
      // ={"center"}
      maxW={"100%"}
      wrap={"wrap"}
    >
      {(expanded ? subjects : subjects.slice(0, 5)).map((subject) => (
        <Tag
          key={subject}
          onClick={() => onSelectSubject(subject)}
          position={"relative"}
          size={"lg"}
          variant={"solid"}
          cursor={"pointer"}
          bg={bgColor}
          borderRadius="full"
          width={"fit-content"}
          m={"0.25rem"}
          px={"20px"}
          py={"10px"}
          border={"1px solid #d3d3d3"}
          borderColor={subjectBorderColor}
          _hover={tagColor}
          top={0}
          zIndex={1}
          color={fontColor}
        >
          <TagLabel>{`${getTopicEmoji(subject)} ${subject}`}</TagLabel>
        </Tag>
      ))}
      {!expanded && subjects.length > 5 && (
        <Tag
          key={"more"}
          onClick={() => setExpanded(true)}
          position={"relative"}
          size={"lg"}
          variant={"solid"}
          cursor={"pointer"}
          bg={"purple.500"}
          borderRadius="full"
          width={"fit-content"}
          m={"0.25rem"}
          px={"20px"}
          py={"10px"}
          border={"1px solid #d3d3d3"}
          borderColor={subjectBorderColor}
          _hover={{
            bg: "purple.600",
          }}
          top={0}
          zIndex={1}
          color={"white"}
        >
          + More
        </Tag>
      )}
    </Flex>
  );
};

const SubjectCloudSection = ({
  title,
  subjects,
  onClickSubject,
}: {
  title: string;
  subjects: string[];
  onClickSubject: (subject: string) => void;
}) => {
  const subjectSelectorWidth = useBreakpointValue({
    base: "90%",
    md: "80%",
  });
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"flex-start"}
      width={subjectSelectorWidth}
      paddingBottom={"1rem"}
    >
      <HStack justifyContent={"flex-start"} w={"100%"}>
        <Text textAlign={"start"} variant={"boldSubheader"}>
          {title}
        </Text>
      </HStack>
      <Flex w={"100%"} wrap={"wrap"}>
        <SubjectCloud subjects={subjects} onSelectSubject={onClickSubject} />
      </Flex>
    </Flex>
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
  const dividerColor = useColorModeValue(
    "1px solid rgba(0, 0, 0, 0.10)",
    "1px solid rgba(255, 255, 255, 0.20)"
  );
  const router = useRouter();
  return (
    <VStack w={"100%"}>
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        py={5}
        width={"100%"}
      >
        <HStack paddingRight={"1rem"} ml={8}>
          <Box minW={"20px"}>
            <BsArrowLeft
              size={20}
              style={{
                margin: "0 1rem",
              }}
              onClick={() => router.back()}
              cursor={"pointer"}
            />
          </Box>
          <Text fontSize={{ base: "18px", md: "22px" }} variant={"subheader"}>
            {title}
          </Text>
        </HStack>
        <AddToFolderButton chatId={id} existingFolderId={folderId} />
      </HStack>
      <Box w={"95%"} borderBottom={dividerColor} />
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
    return newMessages.map((message, idx) => {
      const key = `${message.type}-${
        message.readableContent?.slice(0, 9).includes("undefined")
          ? message.readableContent?.slice(9, 50)
          : message.readableContent?.slice(0, 50)
      }-${idx}`;
      return <MessageRowBubble key={key} message={message} />;
    });
  }, [
    messages,
    beingStreamedChatId,
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

  const { userData } = useAuth();

  const availableKeys = useMemo(() => {
    if (userData?.email.includes("@judie.io")) {
      return Object.keys(subjectSectionToSubjectsMap);
    }
    // TODO: Use user profile's purpose here to find the right subjects
    const subjectsCopy = { ...subjectSectionToSubjectsMap };
    delete subjectsCopy["Admin"];
    return Object.keys(subjectSectionToSubjectsMap);
  }, [subjectSectionToSubjectsMap, userData]);

  return (
    <Flex
      h={"100%"}
      w={"100%"}
      gap={0}
      direction={"column"}
      p={{ base: 1, md: "20px 20px 20px 30px" }}
    >
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
              <Flex
                position={"relative"}
                overflowY={"scroll"}
                alignItems={"center"}
                justifyContent={"center"}
                h={"100%"}
                w={"80%"}
              >
                <VStack w={"100%"} alignItems={"center"} h={"100%"} pt={"5rem"}>
                  <Text
                    variant={"header"}
                    textAlign={{ base: "center", md: "unset" }}
                  >
                    It&apos;s a great time to learn!
                  </Text>
                  <Text
                    variant={"subheaderDetail"}
                    mb={"2rem"}
                    textAlign={{ base: "center", md: "unset" }}
                  >
                    Select a topic below to get started
                  </Text>
                  <Flex
                    width={"100%"}
                    overflowY={"auto"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={"50%"}
                    wrap={"wrap"}
                  >
                    {availableKeys.map((section) => (
                      <SubjectCloudSection
                        key={section}
                        title={section}
                        subjects={subjectSectionToSubjectsMap[section]}
                        onClickSubject={(subject) => {
                          submitSubject(subject);
                        }}
                      />
                    ))}
                  </Flex>
                </VStack>
              </Flex>
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
              <Spacer />
              <ChatFooter />
            </ScrollContainerBubbles>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Chat;
