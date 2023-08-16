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
import { Room } from "@judie/data/types/api";
import { useRouter } from "next/router";

const RoomsTable = ({ rooms }: { rooms: Room[] }) => {
  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  return (
    <TableContainer>
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            {/* TODO:
            <Th># Students</Th>
            <Th># Teachers</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {rooms?.map((room) => (
            <Tr
              key={room.id}
              onClick={() => {
                router.push(`/admin/rooms/${room.id}`);
              }}
              cursor={"pointer"}
              _hover={{
                backgroundColor: rowBackgroundColor,
                transition: "ease-in-out 0.3s",
              }}
            >
              <Td>{room.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RoomsTable;
