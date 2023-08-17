import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  useToast,
} from "@chakra-ui/react";
import { resendInviteMutation } from "@judie/data/mutations";
import { Invite } from "@judie/data/types/api";
import { FiRefreshCcw } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import { useMutation } from "react-query";

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
  const toast = useToast();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const resendInvite = useMutation({
    mutationFn: resendInviteMutation,
    onSuccess: () => {
      toast({
        title: "Invite resent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return (
    <TableContainer>
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Created at</Th>
            {/* <Th>Permissions</Th> */}
            <Th>Resend Invite</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invites?.map((invite) => (
            <Tr
              key={invite.id}
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
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() =>
                    invite?.id
                      ? resendInvite.mutate({ inviteId: invite.id })
                      : () => {}
                  }
                >
                  <FiRefreshCcw size={20} />
                </Button>
              </Td>
              {/* <Td>
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
              </Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default InvitesTable;
