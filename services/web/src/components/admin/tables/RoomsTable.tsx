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

const RoomsTable = ({ rooms }: { rooms: Room[] }) => {
  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");

  const [deleteRoomId, setDeleteRoomId] = useState<string | null>();

  const openDeleteModal = (roomId: string) => {
    setDeleteRoomId(roomId);
  };
  return (
    <TableContainer>
      {deleteRoomId && (
        <DeleteRoomModal
          roomId={deleteRoomId}
          isOpen={!!deleteRoomId}
          onClose={() => {
            setDeleteRoomId(null);
          }}
        />
      )}
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rooms?.map((room) => (
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
                    openDeleteModal(room.id);
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
