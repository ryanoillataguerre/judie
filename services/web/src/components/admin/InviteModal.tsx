import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  CreatePermissionType,
  bulkInviteMutation,
  createInviteMutation,
} from "@judie/data/mutations";
import { GradeYear, PermissionType } from "@judie/data/types/api";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "../Button/Button";
import { HTTPResponseError } from "@judie/data/baseFetch";
import useAdminActiveEntities from "@judie/hooks/useAdminActiveEntities";

export const getPermissionTypeLabel = (type: PermissionType) => {
  switch (type) {
    case PermissionType.ORG_ADMIN:
      return "Organization Admin";
    case PermissionType.SCHOOL_ADMIN:
      return "Principal / School Admin";
    case PermissionType.ROOM_ADMIN:
      return "Teacher / Class Admin";
    case PermissionType.STUDENT:
      return "Student";
    default:
      return "Unknown";
  }
};

interface SubmitData {
  gradeYear?: GradeYear;
  email: string;
  permissionType?: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}

export enum InviteModalType {
  ROOM = "room",
  SCHOOL = "school",
  ORGANIZATION = "organization",
}
const InviteModalBody = ({
  onClose,
  type,
}: {
  onClose: () => void;
  type: InviteModalType;
}) => {
  const toast = useToast();
  const createInvite = useMutation({
    mutationFn: createInviteMutation,
  });
  const { organizationId, schoolId, roomId, organization, school, room } =
    useAdminActiveEntities();

  const [permissionType, setPermissionType] = useState<
    PermissionType | undefined
  >(undefined);
  const { handleSubmit, register, watch } = useForm<SubmitData>({
    defaultValues: {
      gradeYear: undefined,
      email: "",
      permissionType: undefined,
    },
    reValidateMode: "onBlur",
  });

  // Set permission type options based on current location
  const permissionOptions = useMemo(() => {
    if (type === InviteModalType.ROOM) {
      return [PermissionType.ROOM_ADMIN, PermissionType.STUDENT];
    }
    if (type === InviteModalType.SCHOOL) {
      return [
        PermissionType.SCHOOL_ADMIN,
        PermissionType.ROOM_ADMIN,
        PermissionType.STUDENT,
      ];
    }
    if (type === InviteModalType.ORGANIZATION) {
      return [
        PermissionType.ORG_ADMIN,
        PermissionType.SCHOOL_ADMIN,
        PermissionType.ROOM_ADMIN,
        PermissionType.STUDENT,
      ];
    }
    return [];
  }, [type]);

  const getBodyText = () => {
    if (type === InviteModalType.ROOM) {
      return (
        <>
          <Text variant={"body"} mb={"1rem"}>
            Invite a user to be a student or teacher in this Classroom.
          </Text>
          <Alert status={"info"} my={"0.5rem"}>
            <AlertIcon />
            <Text variant={"title"}>
              You are inviting the user to be in the Classroom {room?.name}.
              They will automatically be associated with the School{" "}
              {school?.name}.
            </Text>
          </Alert>
        </>
      );
    }
    if (type === InviteModalType.SCHOOL) {
      return (
        <>
          <Text variant={"body"} mb={"1rem"}>
            Invite a user to be a student or admin in this school or one of its
            Classrooms.
          </Text>
          <Text variant={"detail"}>
            Teachers can view and edit their Classrooms.
          </Text>
          <Alert status={"info"} my={"0.5rem"}>
            <AlertIcon />
            <Text variant={"title"}>
              You are inviting the user to be in the School {school?.name}.
            </Text>
          </Alert>
        </>
      );
    }
    if (type === InviteModalType.ORGANIZATION) {
      return (
        <>
          <Text variant={"body"} mb={"1rem"}>
            Invite a user to be a Student, Teacher, Principal, or Org Admin in
            this Organization or one of its Schools or Classrooms.
          </Text>
          <Text variant={"detail"} mb={"1rem"}>
            Principals can view and edit a school, teachers can view and edit
            their Classrooms, and Organization Admins can view and edit the same
            things that you can.
          </Text>
          <Alert status={"info"} my={"0.5rem"}>
            <AlertIcon />
            <Text variant={"title"}>
              You are inviting the user to be in the Organization{" "}
              {organization?.name}.
            </Text>
          </Alert>
        </>
      );
    }
    return null;
  };

  const onSubmit: SubmitHandler<SubmitData> = async ({
    gradeYear,
    email,
    permissionType,
  }: SubmitData) => {
    try {
      if (!permissionType) {
        toast({
          title: "Oops!",
          description: "Please select a role",
          status: "error",
        });
        return;
      }
      await createInvite.mutateAsync({
        gradeYear,
        email,
        permissions: [
          {
            type: permissionType,
            organizationId,
            schoolId,
            roomId,
          },
        ],
      });
      // Toast
      toast({
        title: "Invite Sent!",
        description: "The user will receive an email with the invite link",
        status: "success",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Oops!",
        description: (err as unknown as HTTPResponseError).message,
        status: "error",
      });
    }
  };
  const email = watch("email");
  const isDisabled = useMemo(() => {
    // Require email and permissionType
    if (!permissionType) {
      return true;
    }
    if (!email) {
      return true;
    }
    if (permissionType === PermissionType.ROOM_ADMIN) {
      return !roomId;
    }
    if (permissionType === PermissionType.SCHOOL_ADMIN) {
      return !schoolId;
    }
    if (permissionType === PermissionType.ORG_ADMIN) {
      return !organizationId;
    }

    return false;
  }, [permissionType, email, roomId, schoolId, organizationId]);
  return (
    <>
      <Text variant={"subheader"}>Invite User</Text>
      <Box width={"100%"} my={"1rem"}>
        {getBodyText()}
      </Box>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
        }}
      >
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
            width: "100%",
          }}
          isRequired
        >
          <FormLabel htmlFor="permissionType">Role</FormLabel>
          <Select
            id="permissionType"
            {...register("permissionType", {})}
            // value={permissionType}
            onChange={(e) =>
              setPermissionType(e.target.value as PermissionType)
            }
          >
            {permissionOptions.map((key) => (
              <option value={key} key={key}>
                {getPermissionTypeLabel(key)}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          style={{
            width: "100%",
            marginTop: "1rem",
          }}
          colorScheme="green"
          variant={"purp"}
          loading={createInvite.isLoading}
          label="Submit"
          isDisabled={isDisabled}
          type="submit"
        />
      </form>
    </>
  );
};

const InviteModal = ({
  isOpen,
  onClose,
  type = InviteModalType.ROOM,
}: {
  isOpen: boolean;
  onClose: () => void;
  type?: InviteModalType;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />
      <ModalContent py={8}>
        <ModalCloseButton />
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <InviteModalBody type={type} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
