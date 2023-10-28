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
import { UseMutationResult, useMutation, useQuery } from "react-query";
import {
  GET_ORG_BY_ID,
  GET_SCHOOL_BY_ID,
  GET_USER_ENTITIES,
  getSchoolByIdQuery,
  getUserEntitiesQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";
import useAuth from "@judie/hooks/useAuth";

const GenericDeleteModal = ({
  isOpen,
  onClose,
  resourceId,
  resourceName,
  messageText,
  subMessageText,
  deleteMutation,
}: {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceName: string;
  messageText: string;
  subMessageText?: string;
  deleteMutation: UseMutationResult<any, unknown, any, unknown> | null;
}) => {
  const { userData } = useAuth();
  const [success, setSuccess] = useState(false);
  // const organizationId = useRouter().query?.organizationId as string;

  // const { refetch } = useQuery({
  //   queryKey: [GET_ORG_BY_ID, organizationId],
  //   queryFn: () => getSchoolByIdQuery(organizationId),
  //   enabled: !!organizationId,
  // });

  // const { refetch: refreshEntities } = useQuery({
  //   queryKey: [GET_USER_ENTITIES, userData?.id],
  //   queryFn: getUserEntitiesQuery,
  //   enabled: false,
  // });

  // const deleteSchool = useMutation({
  //   mutationFn: deleteSchoolMutation,
  //   onSuccess: () => {
  //     setSuccess(true);
  //     // refetch();
  //     // refreshEntities();
  //     onClose();
  //   },
  // });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />
      <ModalContent py={8}>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
            textAlign={"center"}
            mb={4}
          >
            {messageText}
          </Text>

          {subMessageText && (
            <Text
              style={{
                fontSize: "1rem",
                fontWeight: 200,
              }}
              textAlign={"center"}
              color={"gray.300"}
            >
              {subMessageText}
            </Text>
          )}

          <Text
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              textAlign: "center",
              width: "100%",
            }}
            my={6}
          >
            <span style={{ color: "#E53e3e" }}>{resourceName}</span>
          </Text>

          <HStack
            mt={4}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => deleteMutation?.mutate(resourceId)}
              isLoading={deleteMutation?.isLoading || false}
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

export default GenericDeleteModal;
