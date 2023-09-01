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
import { User } from "@judie/data/types/api";
import { useRouter } from "next/router";

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
}) => {
  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  return (
    <TableContainer>
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
          {users?.map((user) => (
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
    </TableContainer>
  );
};

export default UsersTable;
