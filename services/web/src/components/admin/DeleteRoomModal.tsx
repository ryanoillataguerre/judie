import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { deleteRoomMutation } from "@judie/data/mutations";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  GET_SCHOOL_BY_ID,
  GET_USER_ENTITIES,
  getSchoolByIdQuery,
  getUserEntitiesQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";
import useAuth from "@judie/hooks/useAuth";

const DeleteRoomModal = ({
  isOpen,
  onClose,
  roomId,
  roomName,
}: {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string | undefined | null;
}) => {
  const { userData } = useAuth();
  const [success, setSuccess] = useState(false);
  const schoolId = useRouter().query?.schoolId as string;
  const { refetch } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, schoolId],
    queryFn: () => getSchoolByIdQuery(schoolId),
    enabled: !!schoolId,
  });
  const { refetch: refreshEntities } = useQuery({
    queryKey: [GET_USER_ENTITIES, userData?.id],
    queryFn: getUserEntitiesQuery,
    enabled: false,
  });

  const deleteRoom = useMutation({
    mutationFn: deleteRoomMutation,
    onSuccess: () => {
      setSuccess(true);
      refetch();
      refreshEntities();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
            Are you sure you want to delete this class?
          </Text>
          {roomName && (
            <Text
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#E53e3e",
                textAlign: "center",
                width: "100%",
              }}
            >
              {roomName}
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
                deleteRoom.mutate({
                  roomId,
                })
              }
              isLoading={deleteRoom.isLoading}
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

export default DeleteRoomModal;
