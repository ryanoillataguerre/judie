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
import { Organization } from "@judie/data/types/api";
import { useRouter } from "next/router";

const OrganizationsTable = ({
  organizations,
}: {
  organizations: Organization[];
}) => {
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
          {organizations?.map((organization) => (
            <Tr
              key={organization.id}
              onClick={() => {
                router.push(`/admin/organizations/${organization.id}`);
              }}
              cursor={"pointer"}
              _hover={{
                backgroundColor: rowBackgroundColor,
                transition: "ease-in-out 0.3s",
              }}
            >
              <Td>{organization.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default OrganizationsTable;
