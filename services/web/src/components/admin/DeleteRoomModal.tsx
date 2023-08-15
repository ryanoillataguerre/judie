import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  createSchoolMutation,
  deleteRoomMutation,
} from "@judie/data/mutations";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import { GET_ORG_BY_ID, getOrgByIdQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";

interface SubmitData {
  name: string;
  address?: string;
}

const DeleteRoomModal = ({
  isOpen,
  onClose,
  roomId,
}: {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}) => {
  const [success, setSuccess] = useState(false);
  const deleteRoom = useMutation({
    mutationFn: deleteRoomMutation,
    onSuccess: () => {
      setSuccess(true);
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
            Are you sure you want to delete this room?
          </Text>
          <HStack
            mt={4}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                deleteRoom.mutate({
                  roomId,
                });
              }}
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
