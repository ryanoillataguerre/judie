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
  Flex,
} from "@chakra-ui/react";
import { Permission } from "@judie/data/types/api";
import SearchBar from "@judie/components/SearchBar/SearchBar";
import { FaTrashAlt } from "react-icons/fa";
import DeletePermissionModal from "../DeletePermissionModal";
import CreatePermissionModal from "../CreatePermissionModal";
import EditPermissionModal from "../EditPermissionModal";
import { EditIcon } from "@chakra-ui/icons";

type PermissionTableProps = {
  permissions: Permission[];
  userName: string;
  userId: string;
};

const PermissionsTable = ({
  permissions,
  userName,
  userId,
}: PermissionTableProps) => {
  const [searchText, setSearchText] = useState("");
  const toast = useToast();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const [deletePermissionId, setDeletePermissionId] = useState<string | null>();
  const [editPermissionId, setEditPermissionId] = useState<string | null>();
  const [selectedPermission, setSelectedPermission] = useState<Permission>();
  const [createPermissionOpen, setCreatePermissionOpen] = useState(false);

  const openDeleteModal = (permissionId: string) => {
    setDeletePermissionId(permissionId);
  };

  const openEditModal = (permissionId: string) => {
    setEditPermissionId(permissionId);
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
          selectedUserId={userId}
        />
      )}

      {editPermissionId && selectedPermission && (
        <EditPermissionModal
          permissionId={editPermissionId}
          permission={selectedPermission}
          isOpen={!!editPermissionId}
          onClose={() => {
            setEditPermissionId(null);
            setSelectedPermission(undefined);
          }}
          selectedUserId={userId}
          userName={userName}
        />
      )}

      <CreatePermissionModal
        isOpen={createPermissionOpen}
        onClose={() => setCreatePermissionOpen(false)}
        userName={userName}
        userId={userId}
      />

      <Flex
        justify={"center"}
        align={"center"}
        gap={"20px"}
        mb={2}
        flexDirection={{ base: "column", md: "row" }}
        position={{ base: "sticky", md: "inherit" }}
        left={{ base: "0", md: "auto" }}
      >
        <SearchBar
          title="Permissions"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Button
          onClick={() => setCreatePermissionOpen(true)}
          colorScheme="green"
          variant={"solid"}
          type="submit"
          width={{ base: "100%", md: "auto" }}
          p={"0 32px"}
        >
          + Add Permission
        </Button>
      </Flex>
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr
            sx={{
              th: {
                padding: "1rem 0.5rem",
              },
            }}
          >
            <Th>Type</Th>
            <Th>Organization</Th>
            <Th>School</Th>
            <Th>Room</Th>
            <Th>Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {permissions
            ?.filter((permission) => {
              if (permission.deletedAt) {
                return false;
              } else {
                if (searchText.trim() == "") {
                  return true;
                }
                const searchString = `${
                  permission?.organization?.name ?? "N/A"
                } ${permission?.school?.name ?? "N/A"} ${
                  permission?.room?.name ?? "N/A"
                }`;
                return searchString
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              }
            })
            .map((permission) => (
              <Tr
                key={permission.id}
                _hover={{
                  backgroundColor: rowBackgroundColor,
                  transition: "ease-in-out 0.3s",
                }}
                sx={{
                  td: {
                    padding: "1rem 0.5rem",
                  },
                }}
              >
                <Td>
                  <Text>{permission.type ?? "N/A"}</Text>
                </Td>
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
                    colorScheme="green"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedPermission(permission);
                      openEditModal(permission.id);
                    }}
                  >
                    <EditIcon boxSize={5} />
                  </Button>
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
                    <FaTrashAlt size={20} color={"red"} />
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PermissionsTable;
