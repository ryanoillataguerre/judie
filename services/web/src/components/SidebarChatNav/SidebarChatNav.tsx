import {
  Flex,
  Button,
  Text,
  Spinner,
  Box,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import {
  deleteChatMutation,
  clearConversationsMutation,
  putChatMutation,
  createChatMutation,
} from "@judie/data/mutations";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { Chat } from "@judie/data/types/api";
import useAuth from "@judie/hooks/useAuth";
import { ChatContext } from "@judie/hooks/useChat";
import { useContext } from "react";
import { useRouter } from "next/router";

import SidebarChatItem from "@judie/components/SidebarChatItem/SidebarChatItem";

const SidebarChatNav = () => {
  const [beingEditedChatId, setBeingEditedChatId] = useState<string | null>(
    null
  );
  const [beingDeletedChatId, setBeingDeletedChatId] = useState<string | null>(
    null
  );

  const [todayChats, setTodayChats] = useState<Chat[]>([]);
  const [yesterdayChats, setYesterdayChats] = useState<Chat[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);

  const toast = useToast();

  const chatContext = useContext(ChatContext);
  const subject = chatContext.chat?.subject;

  const router = useRouter();
  const auth = useAuth();

  const today = useRef<Date>(new Date());
  const yesterday = useRef<Date>(new Date(today.current));
  const beforeYesterday = useRef<Date>(new Date(today.current));
  const recently = useRef<Date>(new Date(today.current));

  useEffect(() => {
    yesterday.current.setDate(yesterday.current.getDate() - 1);

    beforeYesterday.current.setDate(beforeYesterday.current.getDate() - 2);

    recently.current.setDate(recently.current.getDate() - 14);
  }, []);

  const {
    data,
    refetch,
    isLoading: isGetChatsLoading,
  } = useQuery([GET_USER_CHATS, auth?.userData?.id], {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });

  useEffect(() => {
    if (data) {
      setTodayChats(
        data.filter((chat) => {
          // get chats that are from the last day
          const chatDate = new Date(chat.createdAt);
          return chatDate >= yesterday.current;
        })
      );
      setYesterdayChats(
        data.filter((chat) => {
          // get chats that are from 1 day ago
          const chatDate = new Date(chat.createdAt);
          return (
            chatDate >= beforeYesterday.current && chatDate < yesterday.current
          );
        })
      );
      setRecentChats(
        data.filter((chat) => {
          // get chats that are from 1 day ago
          const chatDate = new Date(chat.createdAt);
          return (
            chatDate >= recently.current && chatDate < beforeYesterday.current
          );
        })
      );
    }
  }, [data]);

  // Delete single chat mutation
  const deleteChat = useMutation({
    mutationFn: () => deleteChatMutation(beingDeletedChatId || ""),
    onSuccess: () => {
      setBeingDeletedChatId(null);
      refetch();
    },
  });

  const createChat = useMutation({
    mutationFn: createChatMutation,
    onSuccess: (data) => {
      // setTimeout(() => {refetch() }, 1000)
      refetch();
      router.push({
        query: {
          id: data.id,
        },
        pathname: "/chat",
      });
    },
  });

  return (
    <>
      <Modal
        isOpen={!!beingDeletedChatId}
        onClose={() => setBeingDeletedChatId(null)}
        size={"md"}
        autoFocus={true}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px)"
          px={"5%"}
        />
        <ModalContent py={8}>
          <ModalBody
            alignItems={"center"}
            textAlign={"center"}
            flexDirection="column"
            justifyContent={"center"}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: "2rem",
              }}
            >
              Are you sure you want to delete this chat?
            </Text>
            <Stack
              direction={{ base: "column-reverse", md: "row" }}
              spacing={8}
              alignItems="center"
              justifyContent="center"
            >
              <Button type="button" onClick={() => setBeingDeletedChatId(null)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                bgColor="red"
                type="button"
                onClick={async () => {
                  if (beingDeletedChatId) {
                    await deleteChat.mutateAsync();
                    setBeingDeletedChatId(null);
                    refetch();
                    if (
                      router.pathname === "/chat" &&
                      router.query.id === beingDeletedChatId
                    ) {
                      router.push("/chat");
                    }
                  } else {
                    toast({
                      title: "Error deleting chat",
                      description: "Please try again",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              >
                <Text color="white">Yes, delete it</Text>
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex
        display={{ sm: "none", md: "unset" }}
        direction={"column"}
        w={"300px"}
        minW={"300px"}
        py={"30px"}
        pr={"20px"}
        gap={"40px"}
        ml={"30px"}
        borderRight={"1px solid rgba(0, 0, 0, 0.10)"}
      >
        <Button
          variant={"outline"}
          colorScheme="white"
          style={{
            width: "100%",
            marginTop: "1rem",
            marginBottom: "1rem",
            borderColor: "#565555",
            padding: "1.5rem",
          }}
          onClick={() => {
            if (
              ((chatContext?.chat?.messages?.length || 0) > 0 &&
                chatContext?.chat?.subject) ||
              !chatContext?.chat
            ) {
              createChat.mutate({});
            }
          }}
        >
          + Create a new chat
        </Button>
        <Flex
          gap={"40px"}
          h={"100%"}
          maxH={"100%"}
          direction={"column"}
          overflow={"scroll"}
        >
          {todayChats.length > 0 && (
            <Box>
              <Text color={"#8F8F8F"}>Today</Text>
              {isGetChatsLoading || !auth?.userData?.id ? (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spinner />
                </Flex>
              ) : (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    overflowY: "scroll",
                    marginTop: "20px",
                  }}
                  gap={"10px"}
                >
                  {todayChats.map((chat) => (
                    <SidebarChatItem
                      chat={chat}
                      key={chat.id}
                      beingEditedChatId={beingEditedChatId}
                      setBeingEditedChatId={(chatId) =>
                        setBeingEditedChatId(chatId)
                      }
                      setBeingDeletedChatId={(chatId) =>
                        setBeingDeletedChatId(chatId)
                      }
                    />
                  ))}
                </Flex>
              )}
            </Box>
          )}

          {yesterdayChats.length > 0 && (
            <Box>
              <Text color={"#8F8F8F"}>Yesterday</Text>
              {isGetChatsLoading || !auth?.userData?.id ? (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spinner />
                </Flex>
              ) : (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    overflowY: "scroll",
                    marginTop: "20px",
                  }}
                  gap={"10px"}
                >
                  {yesterdayChats.map((chat) => (
                    <SidebarChatItem
                      chat={chat}
                      key={chat.id}
                      beingEditedChatId={beingEditedChatId}
                      setBeingEditedChatId={(chatId) =>
                        setBeingEditedChatId(chatId)
                      }
                      setBeingDeletedChatId={(chatId) =>
                        setBeingDeletedChatId(chatId)
                      }
                    />
                  ))}
                </Flex>
              )}
            </Box>
          )}

          {recentChats.length > 0 && (
            <Box>
              <Text color={"#8F8F8F"}>Recent</Text>
              {isGetChatsLoading || !auth?.userData?.id ? (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spinner />
                </Flex>
              ) : (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    overflowY: "scroll",
                    marginTop: "20px",
                    overflowX: "scroll",
                  }}
                  gap={"10px"}
                >
                  {recentChats.map((chat) => (
                    <SidebarChatItem
                      chat={chat}
                      key={chat.id}
                      beingEditedChatId={beingEditedChatId}
                      setBeingEditedChatId={(chatId) =>
                        setBeingEditedChatId(chatId)
                      }
                      setBeingDeletedChatId={(chatId) =>
                        setBeingDeletedChatId(chatId)
                      }
                    />
                  ))}
                </Flex>
              )}
            </Box>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default SidebarChatNav;
