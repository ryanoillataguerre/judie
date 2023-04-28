import { useMutation, useQuery } from "react-query";
import styles from "./Chats.module.scss";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  CloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { MessageType } from "@judie/data/types/api";
import {
  ChatResponse,
  deleteChatMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { BsTrash } from "react-icons/bs";
import { HiOutlinePencil } from "react-icons/hi";
import { FormEvent, useState } from "react";
import Button, { ButtonVariant } from "../Button/Button";

const Chats = ({
  seenAlert,
  onClickDismissAlert,
}: {
  seenAlert: boolean;
  onClickDismissAlert: () => void;
}) => {
  const { data, refetch } = useQuery(GET_USER_CHATS, {
    queryFn: getUserChatsQuery,
    staleTime: 30000,
  });

  const router = useRouter();
  const onClickChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const { isOpen: isVisible, onClose } = useDisclosure({
    defaultIsOpen: !seenAlert,
    onClose: () => {
      onClickDismissAlert();
    },
  });
  const getTitleForChat = (chat: ChatResponse) => {
    if (chat.userTitle) {
      return chat.userTitle;
    }
    if (chat.messages?.[0]?.content) {
      if (chat.messages?.[0]?.type !== MessageType.SYSTEM) {
        return chat.messages?.[0]?.content.slice(0, 100) + "...";
      }
    }
    return "Untitled Chat";
  };

  // Delete logic
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [beingDeletedChatId, setBeingDeletedChatId] = useState<string>();

  const deleteChat = useMutation({
    mutationFn: deleteChatMutation,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      refetch();
    },
  });
  const openDeleteModal = (chatId: string) => {
    setBeingDeletedChatId(chatId);
    setIsDeleteModalOpen(true);
  };
  // Edit Title Logic
  const [beingEditedChatId, setBeingEditedChatId] = useState<string>();
  const [editingTitle, setEditingTitle] = useState<string>();
  const editTitleMutation = useMutation({
    mutationFn: ({ title }: { title: string }) =>
      putChatMutation({
        chatId: beingEditedChatId || "",
        userTitle: title,
      }),
  });

  return (
    <div className={styles.chatsPageContainer}>
      {/* Delete modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <div className={styles.modalContentContainer}>
            <ModalHeader>
              <h1>
                Are you sure you want to delete this chat? This action cannot be
                undone.
              </h1>
            </ModalHeader>
            <ModalFooter
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <Button
                variant={ButtonVariant.Transparent}
                onClick={() => setIsDeleteModalOpen(false)}
                label={"Cancel"}
              />
              <Button
                variant={ButtonVariant.RedTransparent}
                onClick={() => deleteChat.mutate(beingDeletedChatId || "")}
                label={"Delete"}
              />
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
      {!seenAlert && (
        <Alert
          status="warning"
          width={"100%"}
          display={"flex"}
          flexDir={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={8}
          borderRadius={8}
          marginBottom={8}
        >
          <Flex height={"100%"} direction={"row"} alignItems={"center"}>
            <AlertIcon />
            <AlertTitle>Just a heads up</AlertTitle>
            <AlertDescription>
              Chats will expire after 24 hours of inactivity. You will be able
              to see a summary of your chat when you access it after that.
            </AlertDescription>
          </Flex>
          <CloseButton onClick={onClose} />
        </Alert>
      )}
      <h1 className={styles.title}>Past Chats</h1>

      {/* TODO: Learn More */}
      {data?.map((chat) => (
        <div key={chat.id} className={styles.chatContainer}>
          <div
            className={styles.leftContainer}
            onClick={() =>
              !beingEditedChatId ? onClickChat(chat.id) : () => {}
            }
          >
            <div className={styles.chatTitle}>
              <Editable
                defaultValue={getTitleForChat(chat)}
                style={{
                  zIndex: 10,
                  width: "100%",
                }}
                onEdit={() => {
                  setBeingEditedChatId(chat.id);
                }}
                onBlur={() => {
                  setBeingEditedChatId(undefined);
                }}
                onSubmit={(value) => {
                  setBeingEditedChatId(undefined);
                  if (value !== getTitleForChat(chat)) {
                    editTitleMutation.mutate({ title: value });
                  }
                }}
              >
                <EditablePreview />
                <EditableInput
                  width={"100%"}
                  onSubmit={(event: FormEvent<HTMLInputElement>) => {
                    event.preventDefault();
                  }}
                />
              </Editable>
            </div>

            {/* <h2 className={styles.chatTitle}>{getTitleForChat(chat)}</h2> */}
            <Badge
              variant={"subtle"}
              colorScheme={chat.subject ? "green" : "gray"}
            >
              {chat.subject ? chat.subject : "No subject selected"}
            </Badge>
          </div>
          <div className={styles.rightContainer}>
            <div
              className={styles.iconContainer}
              onClick={() => openDeleteModal(chat.id)}
            >
              <BsTrash size={16} color={"red"} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
