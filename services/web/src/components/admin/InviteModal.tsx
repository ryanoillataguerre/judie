import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
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
  bulkInviteMutation,
  createInviteMutation,
} from "@judie/data/mutations";
import { GradeYear } from "@judie/data/types/api";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "../Button/Button";
import PermissionsWidget from "./PermissionsWidget";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import useAdminActiveOrganization from "@judie/hooks/useAdminActiveOrganization";

interface SubmitData {
  gradeYear?: GradeYear;
  email: string;
  permissions: CreatePermissionType[];
}

const SingleInviteModalBody = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const createInvite = useMutation({
    mutationFn: createInviteMutation,
  });
  const { handleSubmit, register } = useForm<SubmitData>({
    defaultValues: {
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
        return;
      }
      await createInvite.mutateAsync({
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
    } catch (err) {
      toast({
        title: "Oops!",
        description: (err as unknown as HTTPResponseError).message,
        status: "error",
      });
    }
  };
  return (
    <>
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
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              width: "100%",
            }}
            isRequired
          >
            <FormLabel htmlFor="permissions">Permissions</FormLabel>
            <PermissionsWidget
              onChangePermissions={setPermissions}
              permissions={permissions}
            />
          </FormControl>

          <Button
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            colorScheme="green"
            variant={"solid"}
            loading={createInvite.isLoading}
            label="Invite User"
            disabled={!permissions.length}
            type="submit"
          />
        </Flex>
      </form>
    </>
  );
};

export enum InviteSheetRole {
  Student,
  Teacher,
  Principal,
  Administrator,
}
export interface InviteRow {
  Email: string;
  Role: InviteSheetRole;
  School?: string;
  Classroom?: string;
}
interface OnSubmitData {
  all: InviteRow[];
  validData: InviteRow[];
  invalidData: InviteRow[];
}
const fields = [
  {
    // Visible in table header and when matching columns.
    label: "Email",
    // This is the key used for this field when we call onSubmit.
    key: "Email",
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "select".
      type: "input",
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: "student@school.edu",
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: "required",
        errorMessage: "Email is required",
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: "error",
      },
    ],
  },
  {
    label: "Role",
    key: "Role",
    fieldType: {
      type: "select",
      options: [
        {
          label: "Student",
          value: "Student",
        },
        {
          label: "Teacher",
          value: "Teacher",
        },
        {
          label: "Principal",
          value: "Principal",
        },
        {
          label: "Administrator",
          value: "Administrator",
        },
      ],
    },
    example: "Student",
    validations: [
      {
        rule: "required",
        errorMessage: "Role is required",
        level: "error",
      },
    ],
  },
  {
    label: "School",
    key: "School",
    fieldType: {
      type: "input",
    },
    example: "Hart High School",
  },
  {
    label: "Classroom",
    key: "Classroom",
    fieldType: {
      type: "input",
    },
    example: "Mr. Smith's 3rd Period Physics",
  },
] as const;

// const rowHookValidator: RowHook<InviteRow> = (
//   data: InviteRow,
//   addError: (
//     fieldKey: InviteRow,
//     error: { message: string; level: string }
//   ) => void
// ) => {
//   // If no email, throw err
//   // If role === student and no school, throw err
//   // If role === teacher and (no school or no room), throw err
//   // If role === principal and no school, throw err
//   // If role === administrator and school or room, throw err
//   return data;
// };

const InviteModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const onCloseUpload = () => {
    setIsUploadOpen(false);
  };
  const organizationId = useAdminActiveOrganization();

  const toast = useToast();

  const bulkMutation = useMutation({
    mutationFn: bulkInviteMutation,
    onSuccess: () => {
      // Toast
      toast({
        title: "Invites Sent!",
        description:
          "The users will receive an email with their corresponding invite link",
        status: "success",
      });
      onClose();
    },
    onError: (err) => {
      toast({
        title: "Oops!",
        description: (err as unknown as HTTPResponseError).message,
        status: "error",
      });
    },
  });

  // TODO: Make these type strict
  const onSubmit = async (defaultData: any) => {
    const data = defaultData as OnSubmitData;
    // Check for errors in rows
    if (data.invalidData?.length) {
      return;
    }

    // If errors, show errors
    // Else: Bulk upload route mutation
    if (organizationId) {
      await bulkMutation.mutateAsync({
        organizationId,
        invites: data.validData?.map((invite) => ({
          email: invite.Email,
          role: invite.Role,
          school: invite.School,
          classroom: invite.Classroom,
        })),
      });
    } else {
      toast({
        title: "Oops!",
        description: "You must be active in an organization to upload invites",
        status: "error",
      });
    }
  };

  useEffect(() => {
    return () => {
      setIsUploadOpen(false);
    };
  }, []);

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
          <SingleInviteModalBody onClose={onClose} />
          <ReactSpreadsheetImport
            isOpen={isUploadOpen}
            onClose={onCloseUpload}
            onSubmit={onSubmit}
            fields={fields}
            // rowHook={rowHookValidator}
          />
          <Flex
            style={{
              width: "100%",
              padding: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: "0.8rem",
              }}
            >
              Want to invite many students at one time?{" "}
              <Link color={"teal.500"} onClick={() => setIsUploadOpen(true)}>
                Upload instead
              </Link>
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
