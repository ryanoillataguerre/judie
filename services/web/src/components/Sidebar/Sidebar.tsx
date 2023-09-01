import {
  useMemo,
  useState,
  CSSProperties,
  useContext,
  useCallback,
} from "react";
import {
  Chat,
  PermissionType,
  SubscriptionStatus,
} from "@judie/data/types/api";
import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Stack,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TfiTrash } from "react-icons/tfi";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import useAuth, { isPermissionTypeAdmin } from "@judie/hooks/useAuth";
import { ChatContext } from "@judie/hooks/useChat";
import { useMutation, useQuery } from "react-query";
import {
  deleteChatMutation,
  clearConversationsMutation,
  createChatMutation,
} from "@judie/data/mutations";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import ColorModeSwitcher from "../ColorModeSwitcher/ColorModeSwitcher";
import UpgradeButton from "../UpgradeButton/UpgradeButton";
import { BiHelpCircle } from "react-icons/bi";
import SidebarChatItem from "@judie/components/SidebarChatItem/SidebarChatItem";
import { getTitleForChat } from "@judie/utils/chat/getTitleForChat";

interface SidebarButtonProps {
  icon?: JSX.Element | undefined;
  label?: string | JSX.Element | undefined;
  key?: string | undefined;
  onClick?: () => void | undefined;
}
const SidebarButton = ({ icon, label, onClick }: SidebarButtonProps) => {
  return (
    <Button variant={"ghost"} onClick={onClick}>
      {icon}
      <Text
        style={{
          marginLeft: "0.5rem",
          fontWeight: 500,
        }}
      >
        {label}
      </Text>
    </Button>
  );
};

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();
  const chatContext = useContext(ChatContext);
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
  const [beingEditedChatId, setBeingEditedChatId] = useState<string | null>(
    null
  );
  const [beingDeletedChatId, setBeingDeletedChatId] = useState<string | null>(
    null
  );
  const [isClearConversationsModalOpen, setIsClearConversationsModalOpen] =
    useState<boolean>(false);
  // Existing user chats
  const {
    data,
    refetch,
    isLoading: isGetChatsLoading,
  } = useQuery([GET_USER_CHATS, auth?.userData?.id], {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });

  // Clear all conversations mutation
  const clearConversations = useMutation({
    mutationFn: clearConversationsMutation,
    onSuccess: () => {
      refetch();
    },
  });

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

  const onAdminClick = useCallback(() => {
    const filteredAdminPermissions = auth.userData?.permissions?.filter(
      (permission) => isPermissionTypeAdmin(permission.type)
    );
    if (filteredAdminPermissions?.length === 1) {
      const permission = filteredAdminPermissions[0];
      switch (permission.type) {
        case PermissionType.ORG_ADMIN:
          router.push(`/admin/organizations/${permission.organizationId}`);
          break;
        case PermissionType.SCHOOL_ADMIN:
          router.push(`/admin/schools/${permission.schoolId}`);
          break;
        case PermissionType.ROOM_ADMIN:
          router.push(`/admin/rooms/${permission.roomId}`);
          break;
        default:
          router.push("/admin");
          break;
      }
      return;
    } else if ((filteredAdminPermissions?.length || 0) > 1 || auth.isAdmin) {
      router.push("/admin");
      return;
    } else {
      toast({
        status: "warning",
        title: "No admin orgs",
      });
    }
  }, [auth.userData?.permissions, auth.isAdmin, router, toast]);

  const footerIcons: SidebarButtonProps[] = useMemo(() => {
    const options = [
      {
        icon: <TfiTrash />,
        key: "delete-chats",
        label: "Clear Conversations",
        onClick: () => {
          setIsClearConversationsModalOpen(true);
        },
      },
      {
        icon: <FiSettings />,
        key: "settings",
        label: "Settings",
        onClick: () => {
          router.push("/settings", undefined, { shallow: true });
        },
      },
      {
        icon: <BiHelpCircle />,
        key: "help",
        label: "Help",
        onClick: () => {
          window.open("https://help.judie.io", "_blank");
        },
      },
      {
        icon: <RiLogoutBoxLine />,
        key: "logout",
        label: "Logout",
        onClick: () => {
          auth.logout();
        },
      },
      ...(auth.isAdmin
        ? [
            {
              icon: <MdAdminPanelSettings />,
              key: "admin",
              label: "Admin",
              onClick: onAdminClick,
            },
          ]
        : []),
      ...(!(
        auth?.userData?.subscription?.status === SubscriptionStatus.ACTIVE
      ) &&
      !auth.isLoading &&
      router.isReady &&
      auth.userData &&
      !auth.isAdmin
        ? [
            {
              key: "upgrade",
              icon: (
                <Box
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    padding: "1rem 0",
                  }}
                >
                  <UpgradeButton />
                </Box>
              ),
            },
          ]
        : []),
      {
        icon: <ColorModeSwitcher />,
        key: "color-mode-switcher",
      },
    ];
    return options;
  }, [auth, router, setIsClearConversationsModalOpen, onAdminClick]);

  const bgColor = useColorModeValue("#FFFFFF", "#2a3448");
  const sidebarRelativeOrAbsoluteProps = useBreakpointValue({
    base: {
      position: "absolute",
      left: 0,
      zIndex: 100,
    },
    md: {},
  });
  return isOpen ? (
    <>
      {/* Modals */}
      {/* Deletion Modal */}
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
      {/* Clear Chat Modal */}
      <Modal
        isOpen={isClearConversationsModalOpen}
        onClose={() => setIsClearConversationsModalOpen(false)}
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
                marginBottom: "1rem",
              }}
            >
              Are you sure you want to delete all of your chats?
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: "2rem",
              }}
            >
              This action is not reversible.
            </Text>
            <Stack
              direction={{ base: "column-reverse", md: "row" }}
              spacing={8}
              alignItems="center"
              justifyContent="center"
            >
              <Button
                type="button"
                onClick={() => setIsClearConversationsModalOpen(false)}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                bgColor="red"
                type="button"
                onClick={async () => {
                  await clearConversations.mutateAsync();
                  setIsClearConversationsModalOpen(false);
                  refetch();
                  if (router.pathname === "/chat") {
                    router.push("/chat");
                  }
                }}
              >
                <Text color="white">Yes, delete all chats</Text>
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Sidebar content */}
      <Flex
        style={{
          width: "18rem",
          maxWidth: "18rem",
          minWidth: "18rem",
          height: "100vh",
          backgroundColor: bgColor,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "1rem",
          ...(sidebarRelativeOrAbsoluteProps as CSSProperties),
        }}
        boxShadow={"lg"}
      >
        <Flex
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          cursor={"pointer"}
          onClick={() => {
            if (router.pathname.includes("/admin")) {
              router.push("/admin");
            } else {
              router.push("/dashboard");
            }
          }}
        >
          <Flex
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              src={logoPath}
              alt="logo"
              style={{
                height: "3rem",
                width: "3rem",
              }}
            />
            <Text
              style={{
                fontSize: "1.3rem",
                fontWeight: "semibold",
                marginLeft: "0.5rem",
              }}
            >
              Judie AI
            </Text>
          </Flex>
        </Flex>

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
              !chatContext.chat
            ) {
              createChat.mutate({});
            }
          }}
        >
          + New Chat
        </Button>
        <Divider backgroundColor="#565555" />
        {/* Chats container - scrollable */}
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
              marginTop: "1rem",
            }}
          >
            {data?.map((chat) => (
              <SidebarChatItem
                chat={chat}
                key={chat.id}
                beingEditedChatId={beingEditedChatId}
                setBeingEditedChatId={(chatId) => setBeingEditedChatId(chatId)}
                setBeingDeletedChatId={(chatId) =>
                  setBeingDeletedChatId(chatId)
                }
              />
            ))}
          </Flex>
        )}
        {/* Bottom container - fixed to bottom */}
        <Flex
          style={{
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingBottom: "1rem",
          }}
        >
          <Divider
            backgroundColor={"#565555"}
            style={{
              marginBottom: "1rem",
            }}
          />
          {footerIcons.map((iconData) => {
            return iconData.label ? (
              <SidebarButton key={iconData.key} {...iconData} />
            ) : (
              iconData.icon
            );
          })}
        </Flex>
      </Flex>
    </>
  ) : (
    <Flex
      style={{
        width: "1rem",
        height: "100vh",
        backgroundColor: bgColor,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        ...(sidebarRelativeOrAbsoluteProps as CSSProperties),
      }}
      boxShadow={"lg"}
    ></Flex>
  );
};

export default Sidebar;
