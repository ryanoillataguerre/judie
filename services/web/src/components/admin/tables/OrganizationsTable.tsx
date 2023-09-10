import { useState } from "react";
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
import SearchBar from "@judie/components/SearchBar/SearchBar";

const OrganizationsTable = ({
  organizations,
}: {
  organizations: Organization[];
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  return (
    <TableContainer>
      <SearchBar
        title="Organizations"
        searchText={searchText}
        setSearchText={setSearchText}
      />
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
          {organizations
            ?.filter((organization) => {
              if (searchText.trim() == "") {
                return true;
              }
              const searchString = `${organization.name}`;
              return searchString
                .toLowerCase()
                .includes(searchText.toLowerCase());
            })
            .map((organization) => (
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
