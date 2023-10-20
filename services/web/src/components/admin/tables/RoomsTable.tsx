import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Room } from "@judie/data/types/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import DeleteRoomModal from "../DeleteRoomModal";
import SearchBar from "@judie/components/SearchBar/SearchBar";

const RoomsTable = ({ rooms }: { rooms: Room[] }) => {
  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");

  const [deleteRoomId, setDeleteRoomId] = useState<string | null>();
  const [deleteRoomName, setDeleteRoomName] = useState<string | null>();
  const [searchText, setSearchText] = useState("");

  const openDeleteModal = (roomId: string, roomName: string) => {
    setDeleteRoomId(roomId);
    setDeleteRoomName(roomName);
  };
  return (
    <TableContainer>
      {deleteRoomId && (
        <DeleteRoomModal
          roomId={deleteRoomId}
          roomName={deleteRoomName}
          isOpen={!!deleteRoomId}
          onClose={() => {
            setDeleteRoomId(null);
            setDeleteRoomName(null);
          }}
        />
      )}
      <SearchBar
        title="Classes"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rooms
            ?.filter((room) => {
              if (searchText.trim() == "") {
                return true;
              }
              const searchString = `${room.name}`;

              return searchString
                .toLowerCase()
                .includes(searchText.toLowerCase());
            })
            .map((room) => (
              <Tr
                key={room.id}
                _hover={{
                  backgroundColor: rowBackgroundColor,
                  transition: "ease-in-out 0.3s",
                }}
              >
                <Td
                  onClick={() => {
                    router.push(`/admin/rooms/${room.id}`);
                  }}
                  cursor={"pointer"}
                >
                  {room.name}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    variant={"ghost"}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteModal(room.id, room.name);
                    }}
                  >
                    <FaTrashAlt size={16} color={"red"} />
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RoomsTable;
