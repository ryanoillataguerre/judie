import {
  Button,
  Center,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { getTitleForChat } from "@judie/utils/chat/getTitleForChat";
import { Chat } from "@judie/data/types/api";
import { useMutation, useQuery } from "react-query";
import { deleteChatMutation } from "@judie/data/mutations";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";

const ChatsTable = ({
  chats,
  isLoading,
  folderName,
  refreshChats,
}: {
  chats?: Chat[];
  isLoading?: boolean;
  folderName?: string;
  refreshChats?: () => void;
}) => {
  const router = useRouter();

  const headerBgColor = useColorModeValue("brand.backgroundLight", "gray.800");
  const rowHoverBgColor = useColorModeValue("gray.100", "gray.700");

  const auth = useAuth();
  const { refetch } = useQuery([GET_USER_CHATS, auth?.userData?.id], {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });

  const deleteChat = useMutation({
    mutationFn: deleteChatMutation,
    onSuccess: () => {
      refetch();
      refreshChats?.();
    },
  });

  return (
    <TableContainer
      width={"100%"}
      height={"100%"}
      // maxH={"100%"}
      minH={"20rem"}
      overflowY={"auto"}
    >
      {isLoading ? (
        <Center width={"100%"} height={"100%"}>
          <Spinner colorScheme={"purple"} />
        </Center>
      ) : chats?.length ? (
        <Table variant={"simple"} size="md">
          <Thead position={"sticky"} top={0} backgroundColor={headerBgColor}>
            <Tr>
              <Th>Name</Th>
              <Th>Folder</Th>
              <Th>Last Message</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {chats?.map((chat) => (
              <Tr
                key={chat.id}
                onClick={() => {
                  router.push(`/chat?id=${chat.id}`);
                }}
                cursor={"pointer"}
                _hover={{
                  backgroundColor: rowHoverBgColor,
                  transition: "ease-in-out 0.3s",
                }}
              >
                <Td>{getTitleForChat(chat)}</Td>
                <Td>{chat.folder?.userTitle || folderName || "--"}</Td>
                <Td>
                  {chat.updatedAt
                    ? new Date(chat.updatedAt)?.toISOString().replace(/T.*/, "")
                    : "--"}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Delete Chat"
                    variant="ghost"
                    size="xs"
                    zIndex={100}
                    borderRadius={8}
                    onClick={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      deleteChat.mutate(chat.id);
                    }}
                    icon={<FaTrashAlt size={14} />}
                  ></IconButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center width={"100%"}>
          <Text variant={"subheaderDetail"}>No chats yet!</Text>
        </Center>
      )}
    </TableContainer>
  );
};

export default ChatsTable;
