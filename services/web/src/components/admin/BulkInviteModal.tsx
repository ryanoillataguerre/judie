import {
  Button,
  Flex,
  Link,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { bulkInviteMutation } from "@judie/data/mutations";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import useAdminActiveOrganization from "@judie/hooks/useAdminActiveEntities";
import { uploadThemeOverride } from "@judie/styles/chakra/chakra";
import { useColorModeValue } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

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

const BulkInviteModal = ({
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
  const { organizationId } = useAdminActiveOrganization();

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
      // If errors, show errors
      toast({
        title: "Oops!",
        description:
          "There are errors in your spreadsheet. Please match the format displayed in the example row.",
        status: "error",
        duration: 6000,
      });
      return;
    }
    console.error(
      "invalid spreadsheet data for " + organizationId,
      data.invalidData
    );

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

  const theme = useColorModeValue({}, uploadThemeOverride);

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
          <ReactSpreadsheetImport
            isOpen={isUploadOpen}
            onClose={onCloseUpload}
            onSubmit={onSubmit}
            fields={fields}
            // rowHook={rowHookValidator}
            customTheme={theme}
          />
          <Flex
            style={{
              width: "100%",
              flexDirection: "column",
              padding: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text variant={"header"} marginBottom={"1rem"}>
              Want to invite many users at one time?{" "}
            </Text>
            <Text variant={"title"} marginBottom={"0.5rem"}>
              Before you upload, please make sure the you have an Excel
              spreadsheet with the following structure for each row:
            </Text>
            <Text variant={"base"}>
              <UnorderedList spacing={"0.5rem"}>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Column A is the user's email
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Column B is one of the following:
                  <UnorderedList>
                    <ListItem>Student</ListItem>
                    <ListItem>Teacher</ListItem>
                    <ListItem>Principal</ListItem>
                    <ListItem>Administrator</ListItem>
                  </UnorderedList>
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  For a Student, Teacher, or Principal, Column C is the School
                  Name (please ensure this is accurate and the school is already
                  created in Judie)
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  For a Student or a Teacher, Column D is the Classroom Name
                  (please ensure this is accurate and the classroom is already
                  created in Judie, and that the classroom is in the school in
                  column C)
                </ListItem>
              </UnorderedList>
            </Text>
            <Button
              marginTop={"1rem"}
              width={"100%"}
              variant={"purp"}
              onClick={() => setIsUploadOpen(true)}
            >
              Upload
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BulkInviteModal;
