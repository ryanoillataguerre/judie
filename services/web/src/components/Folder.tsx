import { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Center,
  Divider,
  HStack,
  Input,
  Text,
  VStack,
  useColorMode,
  useToast,
  useToken,
  IconButton,
} from "@chakra-ui/react";
import {
  createChatMutation,
  deleteFolderMutation,
} from "@judie/data/mutations";
import { GET_FOLDER_BY_ID, getFolderByIdQuery } from "@judie/data/queries";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import { TbPencil } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineCheck } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { useMutation, useQuery } from "react-query";
import ChatsTable from "./ChatsTable";
import { HiMiniFolderOpen } from "react-icons/hi2";

import GenericDeleteModal from "./GenericDeleteModal";

const Folder = ({ id }: { id: string }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [folderTitle, setFolderTitle] = useState<string>("");
  const [newfolderTitle, setNewFolderTitle] = useState<string>("");
  const [deleteFolderModalOpen, setDeleteFolderModalOpen] = useState(false);

  const router = useRouter();
  const toast = useToast();
  const folderQuery = useQuery({
    queryKey: [GET_FOLDER_BY_ID, id],
    queryFn: () => getFolderByIdQuery({ id }),
    onSuccess: (data) => {
      setFolderTitle(data.userTitle ?? "");
    },
  });

  const createChat = useMutation({
    mutationFn: createChatMutation,
    onSuccess: ({ id }) => {
      router.push({
        pathname: "/chat",
        query: {
          id,
        },
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error creating chat",
        description: "Sorry, there was an error creating your chat",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const deleteSchool = useMutation({
    mutationFn: deleteFolderMutation,
    onSuccess: () => {
      // setSuccess(true);
      // refetch();
      // refreshEntities();
      setDeleteFolderModalOpen(false);
    },
  });

  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);
  return (
    <VStack
      paddingX={"2rem"}
      paddingY={"1rem"}
      h={"100%"}
      w={"100%"}
      overflowY={"auto"}
    >
      {deleteFolderModalOpen && (
        <GenericDeleteModal
          isOpen={deleteFolderModalOpen}
          onClose={() => setDeleteFolderModalOpen(false)}
          resourceId={id}
          resourceName={folderQuery.data?.userTitle?.slice(0, 30) || ""}
          messageText={"Are you sure you want to delete this folder?"}
          subMessageText={"(The chats in this folder will not be deleted.)"}
          deleteMutation={deleteSchool}
        />
      )}

      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingY={"1rem"}
        width={"100%"}
      >
        <HStack overflow={"hidden"} width={"100%"}>
          <BsArrowLeft
            size={20}
            style={{
              margin: "0 1rem",
              minWidth: "20px",
            }}
            onClick={() => router.back()}
            cursor={"pointer"}
          />
          <Center borderRadius={"0.5rem"} padding={"0.5rem"} bgColor={"white"}>
            <HiMiniFolderOpen size={24} color={purpleHexCode} />
          </Center>
          {isEditingTitle ? (
            <HStack w={"100%"}>
              <Input
                type={"text"}
                value={folderTitle}
                onChange={(e) => setFolderTitle(e.target.value)}
                placeholder="Folder name"
                width={"100%"}
              />
              <IconButton
                onClick={() => setIsEditingTitle(false)}
                colorScheme="green"
                aria-label="Save folder name"
                icon={<AiOutlineCheck />}
                size={"sm"}
                borderRadius={"0.5rem"}
              />
              <IconButton
                onClick={() => setIsEditingTitle(false)}
                colorScheme="red"
                aria-label="cancel folder name edit"
                icon={<RxCross2 />}
                size={"sm"}
                borderRadius={"0.5rem"}
              />
            </HStack>
          ) : (
            <>
              <Text
                variant={"subheader"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                overflow={"hidden"}
                flexGrow={1}
              >
                {folderQuery?.data?.userTitle}
              </Text>
              <IconButton
                onClick={() => setIsEditingTitle(true)}
                colorScheme="gray"
                aria-label="edit folder name"
                icon={<TbPencil size={20} />}
                size={"sm"}
                borderRadius={"0.5rem"}
              />
              <IconButton
                onClick={() => setDeleteFolderModalOpen(true)}
                colorScheme="gray"
                aria-label="cancel folder name edit"
                icon={<FaTrashAlt />}
                size={"sm"}
                borderRadius={"0.5rem"}
              />
            </>
          )}
        </HStack>
        <Box />
      </HStack>
      <Divider />
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingY={"0.5rem"}
        width={"100%"}
      >
        <Text variant={"title"}>Chats</Text>
        <Button
          variant={"secondary"}
          onClick={() =>
            createChat.mutate({
              folderId: id,
            })
          }
        >
          <Text variant={"button"}>+ Create a chat in folder</Text>
        </Button>
      </HStack>
      <ChatsTable
        isLoading={folderQuery.isLoading}
        chats={folderQuery.data?.chats}
        refreshChats={folderQuery.refetch}
        folderName={folderQuery.data?.userTitle || undefined}
      />
    </VStack>
  );
};

export default Folder;
