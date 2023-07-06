import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  CreatePermissionType,
  createInviteMutation,
} from "@judie/data/mutations";
import { GradeYear } from "@judie/data/types/api";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "../Button/Button";
import PermissionsWidget from "./PermissionsWidget";

interface SubmitData {
  firstName: string;
  lastName: string;
  gradeYear?: GradeYear;
  email: string;
  permissions: CreatePermissionType[];
}

const InviteModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const createInvite = useMutation({
    mutationFn: createInviteMutation,
  });
  const { handleSubmit, register, reset } = useForm<SubmitData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gradeYear: undefined,
      email: "",
    },
    reValidateMode: "onBlur",
  });
  const [permissions, setPermissions] = useState<CreatePermissionType[]>([]);

  useEffect(() => {
    return () => {
      setPermissions([]);
    };
  }, []);

  const onSubmit: SubmitHandler<SubmitData> = async ({
    firstName,
    lastName,
    gradeYear,
    email,
  }: SubmitData) => {
    try {
      if (!permissions.length) {
        toast({
          status: "error",
          title: "Must attach permissions",
          description: "We need to know what to do with this user",
        });
      }
      await createInvite.mutateAsync({
        firstName,
        lastName,
        gradeYear: (gradeYear as string) === "None" ? undefined : gradeYear,
        email,
        permissions,
      });
      // Toast
      toast({
        title: "Invite Sent!",
        description: "The user will receive an email with the invite link",
        status: "success",
      });
      setPermissions([]);
      onClose();
    } catch (err) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
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
            Add a user
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
                Enter the user's info below and attach them to an organization,
                school, or room for them to start out.
              </Text>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input id="firstName" required {...register("firstName", {})} />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Input id="lastName" {...register("lastName", {})} />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" type="email" {...register("email", {})} />
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <FormLabel htmlFor="gradeYear">Grade Year</FormLabel>
                <Select id="gradeYear" {...register("gradeYear", {})}>
                  <option value={undefined}>{"None"}</option>
                  {/* TODO Ryan: Make user-facing versions of these */}
                  {Object.keys(GradeYear).map((key) => (
                    <option value={key}>{key}</option>
                  ))}
                </Select>
              </FormControl>
              <Box
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  width: "100%",
                }}
              >
                <FormLabel htmlFor="permissions">Permissions</FormLabel>
                <PermissionsWidget
                  onChangePermissions={setPermissions}
                  permissions={permissions}
                />
              </Box>

              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                colorScheme="green"
                variant={"solid"}
                loading={createInvite.isLoading}
                label="Invite User"
                type="submit"
              />
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;