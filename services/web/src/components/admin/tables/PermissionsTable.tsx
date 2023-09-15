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
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import { resendInviteMutation } from "@judie/data/mutations";
import { Invite, Permission } from "@judie/data/types/api";
import { FiRefreshCcw } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import { useMutation } from "react-query";
import SearchBar from "@judie/components/SearchBar/SearchBar";
import { FaTrashAlt } from "react-icons/fa";
import DeletePermissionModal from "../DeletePermissionModal";

type PermissionTableProps = {
  permissions: Permission[];
};

const PermissionsTable = ({ permissions }: PermissionTableProps) => {
  const [searchText, setSearchText] = useState("");
  const toast = useToast();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const [deletePermissionId, setDeletePermissionId] = useState<string | null>();

  const openDeleteModal = (permissionId: string) => {
    setDeletePermissionId(permissionId);
  };

  return (
    <TableContainer>
      {deletePermissionId && (
        <DeletePermissionModal
          permissionId={deletePermissionId}
          permission={permissions.find((p) => p.id === deletePermissionId)}
          isOpen={!!deletePermissionId}
          onClose={() => {
            setDeletePermissionId(null);
          }}
        />
      )}
      <SearchBar
        title="Invites"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Organization</Th>
            <Th>School</Th>
            <Th>Room</Th>
          </Tr>
        </Thead>
        <Tbody>
          {permissions
            ?.filter((permission) => {
              if (permission.deletedAt) {
                return false;
              } else {
                return true;
              }
            })
            .map((permission) => (
              <Tr
                key={permission.id}
                _hover={{
                  backgroundColor: rowBackgroundColor,
                  transition: "ease-in-out 0.3s",
                }}
              >
                <Td>
                  <Text>{permission.organization?.name ?? "N/A"}</Text>
                </Td>
                <Td>
                  <Text>{permission.school?.name ?? "N/A"}</Text>
                </Td>
                <Td>
                  <Text>{permission.room?.name ?? "N/A"}</Text>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    variant={"ghost"}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteModal(permission.id);
                    }}
                  >
                    <FaTrashAlt size={16} color={"red"} />
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

export default PermissionsTable;
