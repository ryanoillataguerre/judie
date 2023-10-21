import {
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
import PermissionsWidget from "./PermissionsWidget";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { uploadThemeOverride } from "@judie/styles/chakra/chakra";
import { useColorModeValue } from "@chakra-ui/react";
import useAdminActiveEntities from "@judie/hooks/useAdminActiveEntities";

interface SubmitData {
  gradeYear?: GradeYear;
  email: string;
  permissions: CreatePermissionType[];
}

const InviteModalBody = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const createInvite = useMutation({
    mutationFn: createInviteMutation,
  });
  const { organizationId, schoolId, roomId } = useAdminActiveEntities();
  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
      gradeYear: undefined,
      email: "",
    },
    reValidateMode: "onBlur",
  });

  // Set permission type options based on current location
  const permissionOptions = useMemo(() => {
    if (roomId) {
      return [PermissionType.ROOM_ADMIN, PermissionType.STUDENT];
    }
    if (schoolId) {
      return [
        PermissionType.SCHOOL_ADMIN,
        PermissionType.ROOM_ADMIN,
        PermissionType.STUDENT,
      ];
    }
    if (organizationId) {
      return [
        PermissionType.ORG_ADMIN,
        PermissionType.SCHOOL_ADMIN,
        PermissionType.ROOM_ADMIN,
        PermissionType.STUDENT,
      ];
    }
    return [];
  }, [organizationId, schoolId, roomId]);

  // Create array of users - each with their own permissionType, email, and gradeYear if student
  const [users, setUsers] = useState<CreatePermissionType[]>([]);

  // Send array to backend

  // const onSubmit: SubmitHandler<SubmitData> = async ({
  //   gradeYear,
  //   email,
  // }: SubmitData) => {
  //   try {
  //     if (!permissions.length) {
  //       toast({
  //         status: "error",
  //         title: "Must attach permissions",
  //         description: "We need to know what to do with this user",
  //       });
  //       return;
  //     }
  //     await createInvite.mutateAsync({
  //       gradeYear,
  //       email,
  //       permissions,
  //     });
  //     // Toast
  //     toast({
  //       title: "Invite Sent!",
  //       description: "The user will receive an email with the invite link",
  //       status: "success",
  //     });
  //     setPermissions([]);
  //     onClose();
  //   } catch (err) {
  //     toast({
  //       title: "Oops!",
  //       description: (err as unknown as HTTPResponseError).message,
  //       status: "error",
  //     });
  //   }
  // };
  return (
    <>
      <Text variant={"subheader"}>Invite Users</Text>
    </>
  );
};

const InviteModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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
          <InviteModalBody onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
