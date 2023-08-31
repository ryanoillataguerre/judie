import React, { useState, useMemo, useEffect } from "react";
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
  Stack,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  useEditableControls,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Chat,
  PermissionType,
  SubscriptionStatus,
} from "@judie/data/types/api";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { putChatMutation } from "@judie/data/mutations";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineCheck } from "react-icons/ai";

import { getTitleForChat } from "@judie/utils/chat/getTitleForChat";
import FileIcon from "@judie/components/icons/FileIcon";
import TrashIcon from "@judie/components/icons/TrashIcon";
import EditIcon from "@judie/components/icons/EditIcon";

const SidebarChatItem = ({
  chat,
  setBeingDeletedChatId,
  setBeingEditedChatId,
  beingEditedChatId,
}: {
  chat: Chat;
  setBeingDeletedChatId: (chatId: string) => void;
  setBeingEditedChatId: (chatId: string | null) => void;
  beingEditedChatId?: string | null;
}) => {
  const router = useRouter();

  const [editingValue, setEditingValue] = useState<string>();

  const selectedChatId = useMemo(() => {
    if (router.query.id) {
      return router.query.id;
    }
  }, [router]);
  const isSelected = selectedChatId === chat.id;

  // Edit single chat title mutation
  const editTitleMutation = useMutation({
    mutationFn: ({ title }: { title: string }) =>
      putChatMutation({
        chatId: beingEditedChatId || "",
        userTitle: title,
      }),
  });

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
      <>
        {isSelected ? (
          <Flex
            style={{
              flexDirection: "row",
              height: "90%",
            }}
            ml={"10px"}
            gap={"10px"}
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
                  <EditIcon boxSize={6} color="#A3A3A3" />
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
                : {
                    onClick: () => setBeingDeletedChatId(chat.id),
                  })}
              icon={
                isEditing ? (
                  <RxCross2 size={18} color={"#A3A3A3"} />
                ) : (
                  <TrashIcon boxSize={6} color="#A3A3A3" />
                )
              }
            />
          </Flex>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <Button
      variant={"ghost"}
      style={{ width: "100%" }}
      zIndex={10}
      py={"15px"}
      px={"20px"}
      borderRadius={"11px"}
      _hover={{
        backgroundColor: "rgba(60, 20, 120, 0.05);",
      }}
      bg={isSelected ? "rgba(60, 20, 120, 0.05);" : "transparent"}
      display={"flex"}
      gap={"10px"}
      maxW={"279px"}
      h={"auto"}
    >
      <FileIcon boxSize={6} />
      <Editable
        onClick={() => {
          if (!editingValue) {
            router.push({
              query: {
                id: chat.id,
              },
              pathname: "/chat",
            });
          }
        }}
        //TODO: default value is truncated when editing
        defaultValue={
          isSelected
            ? getTitleForChat(chat, true)
            : chat.userTitle ?? chat.subject
        }
        placeholder={getTitleForChat(chat, true)}
        style={{
          fontSize: 16,
          fontWeight: 500,
          width: "100%",
        }}
        isPreviewFocusable={false}
        onChange={(value) => {
          setEditingValue(value);
        }}
        submitOnBlur={false}
        onSubmit={async () => {
          if (editingValue !== getTitleForChat(chat, true)) {
            await editTitleMutation.mutateAsync({
              title: editingValue as string,
            });
          }
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
          }}
        >
          <Flex
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <EditablePreview p={0} w={"fit-content"} cursor="pointer" />
            <Input h={"unset"} p={0} textAlign={"start"} as={EditableInput} />
          </Flex>
          <EditableControls />
        </Flex>
      </Editable>
    </Button>
  );
};

export default SidebarChatItem;
