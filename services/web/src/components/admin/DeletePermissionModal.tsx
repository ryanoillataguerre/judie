import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { deletePermissionMutation } from "@judie/data/mutations";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  GET_PERMISSIONS_BY_ID,
  getPermissionsByIdQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";
import useAuth from "@judie/hooks/useAuth";
import { Permission } from "@judie/data/types/api";

const DeletePermissionModal = ({
  isOpen,
  onClose,
  permissionId,
  permission,
}: {
  isOpen: boolean;
  onClose: () => void;
  permissionId: string;
  permission: Permission | undefined | null;
}) => {
  const { userData } = useAuth();
  const [success, setSuccess] = useState(false);
  // const permissionId = useRouter().query?.PermissionId as string;
  const { refetch } = useQuery({
    queryKey: [GET_PERMISSIONS_BY_ID, permissionId],
    queryFn: () => getPermissionsByIdQuery(permissionId),
    enabled: !!permissionId,
  });

  const deletePermission = useMutation({
    mutationFn: deletePermissionMutation,
    onSuccess: () => {
      setSuccess(true);
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
            <Text
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#E53e3e",
                textAlign: "center",
                width: "100%",
              }}
            >
              {permission?.organization?.name ?? "N/A"} ::{" "}
              {permission?.school?.name ?? "N/A"} ::{" "}
              {permission?.room?.name ?? "N/A"}
            </Text>
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
