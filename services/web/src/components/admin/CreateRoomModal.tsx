import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { createRoomMutation } from "@judie/data/mutations";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import {
  GET_ORG_BY_ID,
  GET_SCHOOL_BY_ID,
  getOrgByIdQuery,
  getSchoolByIdQuery,
} from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";

interface SubmitData {
  name: string;
}

const CreateRoomModal = ({
  isOpen,
  onClose,
  organizationId,
  schoolId,
}: {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  schoolId: string;
}) => {
  const { refreshEntities } = useAuth();
  const [success, setSuccess] = useState(false);
  const createRoom = useMutation({
    mutationFn: createRoomMutation,
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const { refetch } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, schoolId],
    queryFn: () => getSchoolByIdQuery(schoolId),
    enabled: !!schoolId,
  });
  const { handleSubmit, register, reset } = useForm<SubmitData>({
    defaultValues: {
      name: "",
    },
    reValidateMode: "onBlur",
  });
  const onSubmit: SubmitHandler<SubmitData> = async ({ name }: SubmitData) => {
    try {
      await createRoom.mutateAsync({
        name,
        schoolId,
        organizationId,
      });
      refetch();
      refreshEntities();
      onClose();
    } catch (err) {}
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
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
            Create a room in your school
          </Text>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
            }}
          >
            <Flex
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                paddingBottom: "1rem",
              }}
            >
              <Text
                style={{
                  fontSize: "1rem",
                  margin: "1rem 0",
                }}
              >
                Enter the room&apos;s name below
              </Text>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="name">Room Name</FormLabel>
                <Input id="name" required {...register("name", {})} />
              </FormControl>
              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                colorScheme="green"
                variant={"solid"}
                loading={createRoom.isLoading}
                label="Create Room"
                type="submit"
              />
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;
