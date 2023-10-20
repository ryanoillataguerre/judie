import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Text,
  VStack,
  useColorMode,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { createChatMutation } from "@judie/data/mutations";
import { GET_FOLDER_BY_ID, getFolderByIdQuery } from "@judie/data/queries";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import ChatsTable from "./ChatsTable";
import { HiMiniFolderOpen } from "react-icons/hi2";

const Folder = ({ id }: { id: string }) => {
  const router = useRouter();
  const toast = useToast();
  const folderQuery = useQuery({
    queryKey: [GET_FOLDER_BY_ID, id],
    queryFn: () => getFolderByIdQuery({ id }),
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

  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);
  return (
    <VStack
      paddingX={"2rem"}
      paddingY={"1rem"}
      h={"100%"}
      w={"100%"}
      overflowY={"scroll"}
    >
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingY={"1rem"}
        width={"100%"}
      >
        <HStack>
          <BsArrowLeft
            size={20}
            style={{
              margin: "0 1rem",
            }}
            onClick={() => router.back()}
            cursor={"pointer"}
          />
          <Center borderRadius={"0.5rem"} padding={"0.5rem"} bgColor={"white"}>
            <HiMiniFolderOpen size={24} color={purpleHexCode} />
          </Center>
          <Text variant={"subheader"}>{folderQuery?.data?.userTitle}</Text>
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
