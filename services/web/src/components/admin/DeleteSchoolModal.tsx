import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  deleteRoomMutation,
  deleteSchoolMutation,
} from "@judie/data/mutations";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  GET_ORG_BY_ID,
  GET_SCHOOL_BY_ID,
  getSchoolByIdQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";

const DeleteSchoolModal = ({
  isOpen,
  onClose,
  schoolId,
}: {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
}) => {
  const [success, setSuccess] = useState(false);
  const organizationId = useRouter().query?.organizationId as string;
  const { refetch } = useQuery({
    queryKey: [GET_ORG_BY_ID, organizationId],
    queryFn: () => getSchoolByIdQuery(organizationId),
    enabled: !!organizationId,
  });
  const deleteSchool = useMutation({
    mutationFn: deleteSchoolMutation,
    onSuccess: () => {
      setSuccess(true);
      refetch();
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
            Are you sure you want to delete this school?
          </Text>
          <HStack
            mt={4}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() =>
                deleteSchool.mutate({
                  schoolId,
                })
              }
              isLoading={deleteSchool.isLoading}
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

export default DeleteSchoolModal;
