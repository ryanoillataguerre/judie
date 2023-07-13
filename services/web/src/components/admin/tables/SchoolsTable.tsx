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
import { School } from "@judie/data/types/api";
import { useRouter } from "next/router";

const SchoolsTable = ({ schools }: { schools: School[] }) => {
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
          {schools?.map((school) => (
            <Tr
              onClick={() => {
                router.push(`/admin/schools/${school.id}`);
              }}
              cursor={"pointer"}
              _hover={{
                backgroundColor: rowBackgroundColor,
                transition: "ease-in-out 0.3s",
              }}
            >
              <Td>{school.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default SchoolsTable;
