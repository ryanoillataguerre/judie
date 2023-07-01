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
import { createSchoolMutation } from "@judie/data/mutations";
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

const CreateSchoolModal = ({
  isOpen,
  onClose,
  organizationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}) => {
  const { refreshEntities } = useAuth();
  const [success, setSuccess] = useState(false);
  const createSchool = useMutation({
    mutationFn: createSchoolMutation,
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const { refetch: refetchOrg } = useQuery({
    queryKey: [GET_ORG_BY_ID, organizationId],
    queryFn: () => getOrgByIdQuery(organizationId),
    enabled: !!organizationId,
  });
  const { handleSubmit, register, reset } = useForm<SubmitData>({
    defaultValues: {
      name: "",
      address: "",
    },
    reValidateMode: "onBlur",
  });
  const onSubmit: SubmitHandler<SubmitData> = async ({
    name,
    address,
  }: SubmitData) => {
    try {
      await createSchool.mutateAsync({
        name,
        address,
        organizationId,
      });
      refetchOrg();
      refreshEntities();
      onClose();
    } catch (err) {}
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);
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
            Create a school in your organization
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
                Enter the school's info below
              </Text>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="name">School Name</FormLabel>
                <Input id="name" required {...register("name", {})} />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <FormLabel htmlFor="address">School Address</FormLabel>
                <Input id="address" {...register("address", {})} />
              </FormControl>
              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                colorScheme="green"
                variant={"solid"}
                loading={createSchool.isLoading}
                label="Create School"
                type="submit"
              />
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateSchoolModal;
