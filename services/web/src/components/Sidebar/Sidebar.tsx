import { useState, useEffect } from "react";
import { BsClockHistory, BsPlusSquareDotted } from "react-icons/bs";
import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TfiTrash } from "react-icons/tfi";
import { FiServer, FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import useAuth from "@judie/hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import {
  ChatResponse,
  deleteChatMutation,
  clearConversationsMutation,
  putChatMutation,
  createChatMutation,
} from "@judie/data/mutations";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { MessageType } from "@judie/data/types/api";
import { BsChatRightText } from "react-icons/bs";
import { TbPencil } from "react-icons/tb";
import { CheckIcon } from "@chakra-ui/icons";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

const getActiveIconIndex = (path: string) => {
  switch (true) {
    case path.includes("/chat/"):
      return 0;
    case path.includes("/chats"):
      return 1;
    case path.includes("/quiz"):
      return 2;
    default:
      return 0;
  }
};
interface SidebarButtonProps {
  icon?: JSX.Element;
  label?: string | JSX.Element;
  onClick?: () => void;
}
const SidebarButton = ({ icon, label, onClick }: SidebarButtonProps) => {
  return (
    <Button colorScheme="white" variant={"ghost"} onClick={onClick}>
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

const getTitleForChat = (chat: ChatResponse, sliced?: boolean) => {
  if (chat.userTitle) {
    const result = chat.userTitle.slice(0, 30);
    if (result.length === 30) {
      return result + "...";
    }
  }
  if (chat.messages?.[0]?.readableContent) {
    if (chat.messages?.[0]?.type !== MessageType.SYSTEM) {
      if (sliced) {
        const result = chat.messages?.[0]?.readableContent.slice(0, 30);
        if (result.length >= 30) {
          return result + "...";
        }
      }
      return chat.messages?.[0]?.readableContent;
    }
  }
  return "Untitled";
};

const SidebarChat = ({
  chat,
  setIsDeleteModalOpen,
  setBeingEditedChatId,
  beingEditedChatId,
}: {
  chat: ChatResponse;
  setIsDeleteModalOpen: (chatId: string) => void;
  setBeingEditedChatId: (chatId: string | null) => void;
  beingEditedChatId?: string | null;
}) => {
  const router = useRouter();
  const selectedChatId = router.query.id as string;
  const isSelected = selectedChatId === chat.id;
  const [editingValue, setEditingValue] = useState<string>();

  // Edit single chat title mutation
  const editTitleMutation = useMutation({
    mutationFn: ({ title }: { title: string }) =>
      putChatMutation({
        chatId: beingEditedChatId || "",
        userTitle: title,
      }),
  });

  console.log(beingEditedChatId);
  // const isEditing = beingEditedChatId === chat.id;

  const EditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();
    // No other good way to set the being edited chat ID other than this unfortunately
    // onClicks are reserved for submitbuttonprops etc.
    useEffect(() => {
      if (isEditing) {
        setBeingEditedChatId(chat.id);
      }
    }, [isEditing]);
    return (
      <Flex
        style={{
          flexDirection: "row",
          height: "90%",
        }}
      >
        <IconButton
          aria-label="Edit Chat Title"
          variant="ghost"
          size="xs"
          zIndex={100}
          // onClick={isEditing ? null : () => setIsBeingEditedChatId(chat.id)}
          {...(isEditing ? getSubmitButtonProps() : getEditButtonProps())}
          icon={
            isEditing ? (
              <AiOutlineCheck size={18} color={"#A3A3A3"} />
            ) : (
              <TbPencil size={18} color="#A3A3A3" />
            )
          }
        />
        <IconButton
          aria-label="Delete Chat"
          variant="ghost"
          size="xs"
          zIndex={100}
          {...(isEditing
            ? getCancelButtonProps()
            : setIsDeleteModalOpen(chat.id))}
          icon={
            isEditing ? (
              <RxCross2 size={18} color={"#A3A3A3"} />
            ) : (
              <TfiTrash size={18} color="#A3A3A3" />
            )
          }
        />
      </Flex>
    );
  };

  console.log(editingValue);

  return (
    <Button
      variant={isSelected ? "solid" : "ghost"}
      style={{ width: "100%", marginTop: "0.3rem", marginBottom: "0.3rem" }}
      zIndex={10}
      onClick={() => {
        if (!editingValue) {
          router.push("/chat", {
            query: {
              id: chat.id,
            },
            pathname: "/chat",
          });
        }
      }}
    >
      <Editable
        defaultValue={getTitleForChat(chat, true)}
        placeholder={getTitleForChat(chat, true)}
        style={{
          fontSize: 14,
          fontWeight: 500,
          width: "100%",
        }}
        isPreviewFocusable={false}
        onChange={(value) => {
          setEditingValue(value);
        }}
        onSubmit={async () => {
          await editTitleMutation.mutateAsync({ title: editingValue });
          setEditingValue("");
          setBeingEditedChatId(null);
        }}
        onAbort={() => {
          setEditingValue("");
        }}
      >
        <Flex
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "0.5rem 0",
          }}
        >
          <Flex
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <EditablePreview cursor="pointer" />
            <Input textAlign={"start"} as={EditableInput} />
          </Flex>
          <EditableControls />
        </Flex>
      </Editable>
    </Button>
  );
};

const OpenCloseButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {};

const Sidebar = () => {
  const router = useRouter();
  const auth = useAuth();
  const activeIconIndex = getActiveIconIndex(router.pathname);
  const [activeIcon, setActiveIcon] = useState<number>(activeIconIndex);
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
  const [beingEditedChatId, setBeingEditedChatId] = useState<string | null>(
    null
  );
  const [beingDeletedChatId, setBeingDeletedChatId] = useState<string | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isClearConversationsModalOpen, setIsClearConversationsModalOpen] =
    useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  // Existing user chats
  const {
    data,
    refetch,
    isLoading: isGetChatsLoading,
  } = useQuery(GET_USER_CHATS, {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
  });

  // Clear all conversations mutation
  const clearConversations = useMutation({
    mutationFn: clearConversationsMutation,
  });

  // Delete single chat mutation
  const deleteChat = useMutation({
    mutationFn: deleteChatMutation,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setBeingDeletedChatId(null);
      refetch();
    },
  });
  const createChat = useMutation({
    mutationFn: createChatMutation,
    onSuccess: (data) => {
      router.push(
        "/chat",
        {
          query: {
            id: data.id,
          },
        },
        {
          shallow: true,
        }
      );
    },
  });

  // Modal logic
  const openDeleteModal = (chatId: string) => {
    setBeingDeletedChatId(chatId);
    setIsDeleteModalOpen(true);
  };

  // TODO: Edit title of chat
  // TODO: Delete chat by ID
  // TODO: Clear all conversations
  const onClickClearConversations = async () => {
    await clearConversations.mutateAsync();
    setIsClearConversationsModalOpen(false);
  };
  const footerIcons: SidebarButtonProps[] = [
    {
      icon: <TfiTrash />,
      label: "Clear Conversations",
      onClick: () => {
        setIsClearConversationsModalOpen(true);
      },
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      onClick: () => {
        router.push("/settings", undefined, { shallow: true });
      },
    },
    {
      icon: <RiLogoutBoxLine />,
      label: "Logout",
      onClick: () => {
        auth.logout();
      },
    },
  ];
  return (
    <>
      <Flex
        style={{
          width: "25vw",
          height: "100vh",
          backgroundColor: "transparent",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "1rem",
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
          onClick={() => createChat.mutate()}
        >
          + New Chat
        </Button>
        <Divider backgroundColor="#565555" />
        {/* Chats container - scrollable */}
        {isGetChatsLoading ? (
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
              <SidebarChat
                chat={chat}
                key={chat.id}
                beingEditedChatId={beingEditedChatId}
                setBeingEditedChatId={(chatId) => setBeingEditedChatId(chatId)}
                setIsDeleteModalOpen={(chatId) => openDeleteModal(chatId)}
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
            paddingBottom: "2rem",
          }}
        >
          <Divider
            backgroundColor={"#565555"}
            style={{
              marginBottom: "1rem",
            }}
          />
          {footerIcons.map((iconData) => {
            return (
              <SidebarButton key={iconData.label as string} {...iconData} />
            );
          })}
        </Flex>
      </Flex>
    </>
  );
};

export default Sidebar;
