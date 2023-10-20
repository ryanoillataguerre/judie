import {
  Button,
  Flex,
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
import { User } from "@judie/data/types/api";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import TableFooter from "./TableFooter";
import SearchBar from "@judie/components/SearchBar/SearchBar";

const USER_PAGE_SIZE = 20;

const UsersTable = ({
  users,
  organizationId,
  schoolId,
  roomId,
}: {
  users: User[];
  roomId?: string;
  schoolId?: string;
  organizationId?: string;
  loading?: boolean;
}) => {
  console.log("organizationId", organizationId);
  console.log("schoolId", schoolId);
  console.log("roomId", roomId);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const [searchText, setSearchText] = useState("");

  const totalPageCount = useMemo(() => {
    if (!users) {
      return 0;
    }
    return Math.ceil(users.length / USER_PAGE_SIZE);
  }, [users]);
  const renderedUsers = useMemo(() => {
    if (!users) {
      return [];
    }
    if (page === 1) {
      return users.slice(0, USER_PAGE_SIZE);
    }
    return users.slice(page * USER_PAGE_SIZE, (page + 1) * USER_PAGE_SIZE);
  }, [users, page]);
  return (
    <TableContainer>
      <SearchBar
        title="Users"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>First name</Th>
            <Th>Last name</Th>
            <Th>Last message</Th>
            <Th>Permissions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {renderedUsers
            ?.filter((user) => {
              if (searchText.trim() == "") {
                return true;
              }
              const searchString = `${user.email} ${user.firstName} ${user.lastName}`;
              return searchString
                .toLowerCase()
                .includes(searchText.toLowerCase());
            })
            .map((user) => (
              <Tr
                key={user.id}
                onClick={() => {
                  router.push(`/admin/users/${user.id}`);
                }}
                cursor={"pointer"}
                _hover={{
                  backgroundColor: rowBackgroundColor,
                  transition: "ease-in-out 0.3s",
                }}
              >
                <Td>{user.email}</Td>
                <Td>{user.firstName || "n/a"}</Td>
                <Td>{user.lastName || "n/a"}</Td>
                <Td>
                  {user.createdAt
                    ? new Date(user.createdAt)?.toLocaleDateString()
                    : "n/a"}
                </Td>
                <Td>
                  {user.permissions?.find((p) => {
                    if (roomId) {
                      return p.roomId === roomId;
                    }
                    if (schoolId) {
                      return p.schoolId === schoolId;
                    }
                    if (organizationId) {
                      return p.organizationId === organizationId;
                    }
                    return false;
                  })?.type || "n/a"}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      {/* Table footer */}
      <TableFooter
        page={page}
        setPage={setPage}
        totalPageCount={totalPageCount}
      />
    </TableContainer>
  );
};

export default UsersTable;
