import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { deletePermissionMutation } from "@judie/data/mutations";
import { useMutation, useQuery } from "react-query";
import {
  GET_PERMISSIONS_BY_ID,
  getPermissionsByIdQuery,
} from "@judie/data/queries";
import { Permission } from "@judie/data/types/api";

type DeletePermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  permissionId: string;
  permission: Permission | undefined | null;
  selectedUserId: string;
};

const DeletePermissionModal = ({
  isOpen,
  onClose,
  permissionId,
  permission,
  selectedUserId,
}: DeletePermissionModalProps) => {
  const { refetch } = useQuery({
    queryKey: [GET_PERMISSIONS_BY_ID, selectedUserId],
    queryFn: () => getPermissionsByIdQuery(selectedUserId),
    enabled: !!selectedUserId,
  });

  const toast = useToast();

  const deletePermission = useMutation({
    mutationFn: deletePermissionMutation,
    onSuccess: () => {
      toast({
        title: "Permission deleted",
        description: "Permission deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
      onClose();
    },
  });

  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />
      <ModalContent py={8}>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this Permission?
          </Text>
          {permission && (
            <TableContainer w={"100%"} p={"24px 0"}>
              <Table variant="simple">
                <Thead>
                  <Tr
                    sx={{
                      th: {
                        padding: "0.5rem",
                      },
                    }}
                  >
                    <Th>Type</Th>
                    <Th>Organization</Th>
                    <Th>School</Th>
                    <Th>Class</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr
                    sx={{
                      td: {
                        padding: "0.5rem",
                      },
                    }}
                  >
                    <Td>{permission.type}</Td>
                    <Td>{permission?.organization?.name ?? "None"}</Td>
                    <Td>{permission?.school?.name ?? "None"}</Td>
                    <Td>{permission?.room?.name ?? "None"}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          )}

          <HStack
            mt={4}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() =>
                deletePermission.mutate({
                  permissionId,
                })
              }
              isLoading={deletePermission.isLoading}
              colorScheme="red"
              mr={4}
            >
              Delete
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeletePermissionModal;
