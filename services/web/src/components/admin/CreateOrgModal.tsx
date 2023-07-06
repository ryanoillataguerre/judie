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
import { createOrgMutation, createSchoolMutation } from "@judie/data/mutations";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import { GET_ORG_BY_ID, getOrgByIdQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";

interface SubmitData {
  name: string;
  primaryContactEmail: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
}

const CreateOrgModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { refreshEntities } = useAuth();
  const [success, setSuccess] = useState(false);
  const createOrg = useMutation({
    mutationFn: createOrgMutation,
    onSuccess: () => {
      setSuccess(true);
    },
  });
  const { handleSubmit, register, reset } = useForm<SubmitData>({
    defaultValues: {
      name: "",
      primaryContactEmail: "",
      primaryContactFirstName: "",
      primaryContactLastName: "",
    },
    reValidateMode: "onBlur",
  });
  const onSubmit: SubmitHandler<SubmitData> = async ({
    name,
    primaryContactEmail,
    primaryContactFirstName,
    primaryContactLastName,
  }: SubmitData) => {
    try {
      await createOrg.mutateAsync({
        name,
        primaryContactEmail,
        primaryContactFirstName,
        primaryContactLastName,
      });
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
            Create an organization
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
                Enter the org's info below
              </Text>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="name">Organization Name</FormLabel>
                <Input id="name" required {...register("name", {})} />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="primaryContactEmail">
                  Primary Contact Email
                </FormLabel>
                <Input
                  id="primaryContactEmail"
                  required
                  {...register("primaryContactEmail", {})}
                />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="primaryContactFirstName">
                  Primary Contact First Name
                </FormLabel>
                <Input
                  id="primaryContactFirstName"
                  required
                  {...register("primaryContactFirstName", {})}
                />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="primaryContactLastName">
                  Primary Contact Last Name
                </FormLabel>
                <Input
                  id="primaryContactLastName"
                  required
                  {...register("primaryContactLastName", {})}
                />
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

export default CreateOrgModal;
