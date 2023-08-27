import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import { useQuery } from "react-query";
import TableFooter from "./admin/tables/TableFooter";
import { useRouter } from "next/router";
import { getTitleForChat } from "./Sidebar/Sidebar";
import { useMemo, useState } from "react";

const ChatsTable = () => {
  const auth = useAuth();
  const router = useRouter();
  const {
    data: chatsData,
    refetch,
    isLoading: isGetChatsLoading,
  } = useQuery([GET_USER_CHATS, auth?.userData?.id], {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });

  const headerBgColor = useColorModeValue(
    "brand.backgroundLight",
    "brand.backgroundDark"
  );

  const rowHoverBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <TableContainer
      width={"100%"}
      height={"100%"}
      maxH={"100%"}
      overflowY={"auto"}
    >
      <Table variant={"simple"} size="md">
        <Thead position={"sticky"} top={0} backgroundColor={headerBgColor}>
          <Tr>
            <Th>Name</Th>
            <Th>Folder</Th>
            <Th>Last edit</Th>
          </Tr>
        </Thead>
        <Tbody>
          {chatsData?.map((chat) => (
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
              <Td>{chat.folder?.userTitle || "n/a"}</Td>
              <Td>
                {chat.updatedAt
                  ? new Date(chat.updatedAt)?.toLocaleDateString()
                  : "n/a"}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ChatsTable;
