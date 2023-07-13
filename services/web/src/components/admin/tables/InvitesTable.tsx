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
import { Invite } from "@judie/data/types/api";

const InvitesTable = ({
  invites,
  organizationId,
  schoolId,
  roomId,
}: {
  invites: Invite[];
  roomId?: string;
  schoolId?: string;
  organizationId?: string;
}) => {
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  return (
    <TableContainer>
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Created at</Th>
            <Th>Permissions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invites?.map((invite) => (
            <Tr
              _hover={{
                backgroundColor: rowBackgroundColor,
                transition: "ease-in-out 0.3s",
              }}
            >
              <Td>{invite.email}</Td>
              <Td>
                {invite.createdAt
                  ? new Date(invite.createdAt)?.toLocaleDateString()
                  : "n/a"}
              </Td>
              <Td>
                {invite.permissions?.find((p) => {
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

export default InvitesTable;
