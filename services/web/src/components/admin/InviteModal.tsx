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

export const getPermissionTypeLabel = (type: PermissionType | undefined) => {
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
      return "--";
  }
};

const getDefaultPermissionTypeForType = (type: InviteModalType) => {
  switch (type) {
    case InviteModalType.ORGANIZATION:
      return PermissionType.ORG_ADMIN;
    case InviteModalType.SCHOOL:
      return PermissionType.SCHOOL_ADMIN;
    case InviteModalType.ROOM:
      return PermissionType.STUDENT;
    default:
      return undefined;
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
  >(PermissionType.STUDENT);
  const [schoolIdSuper, setSchoolIdSuper] = useState<string | undefined>(
    undefined
  );

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
            Invite a user to be a student, teacher, or Principal in this School.
            You can add them to specific classrooms once they accept their
            invite.
          </Text>
          <Text variant={"detail"}>
            Teachers can view and edit their Classrooms and the users in them.
          </Text>
          <Text variant={"detail"}>
            Principals can view and edit the School, and Classrooms within the
            school.
          </Text>
          <Alert status={"info"} my={"0.5rem"}>
            <AlertIcon />
            <Text variant={"title"}>
              You are inviting the user to be in the School {school?.name}. If
              you&apos;d like to invite them to a specific Classroom, please
              exit and click into the Classroom before you invite them.
            </Text>
          </Alert>
        </>
      );
    }
    if (type === InviteModalType.ORGANIZATION) {
      return (
        <>
          <Text variant={"detail"} mb={"1rem"}>
            Principals can view and edit a school, teachers can view and edit
            their Classrooms, and Organization Admins can view and edit the same
            things that you can.
          </Text>
          <Alert status={"warning"} my={"0.5rem"}>
            <AlertIcon />
            <Text variant={"title"}>
              You are inviting the user to the Organization {organization?.name}
              . Be careful with permissions, as you can add Org Admins, School
              Admins, Teachers, and Students.
            </Text>
          </Alert>
        </>
      );
    }
    return null;
  };

  const roomOptions = useMemo(() => {
    if (schoolIdSuper) {
      const school = organization?.schools?.find(
        (school) => school.id === schoolIdSuper
      );
      return school?.rooms || [];
    }
    return school?.rooms || [];
  }, [schoolIdSuper, school?.rooms, organization?.schools]);
  const [roomIdSuper, setRoomIdSuper] = useState<string | undefined>(
    roomOptions[0]?.id || undefined
  );

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
            schoolId: schoolIdSuper || schoolId,
            roomId: roomIdSuper || roomId,
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

  const getExtraFieldsFromType = () => {
    // For org admin, return none
    // For school admin, and if type === org, return school
    // For school admin, and if type === school, return none
    // For room admin, and if type === school, return room
    // For room admin, and if type === org, return school and room
    // For room admin, and if type === room, return none
    // For student, and if type === room, return none
    // For student, and if type === school, return room
    // For student, and if type === org, return school and room

    const caseForRoomLevel = () => {
      if (type === InviteModalType.ORGANIZATION) {
        const schoolOptions = organization?.schools || [];

        return (
          <>
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired
            >
              <FormLabel htmlFor="schoolId">School</FormLabel>
              <Select
                id="schoolId"
                value={schoolIdSuper}
                onChange={(e) => setSchoolIdSuper(e.target.value)}
              >
                <option value={undefined}>Select a School</option>
                {schoolOptions.map((school) => (
                  <option value={school.id} key={school.id}>
                    {school.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {schoolIdSuper && (
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  width: "100%",
                }}
                isRequired
              >
                <FormLabel htmlFor="roomId">Classroom</FormLabel>
                <Select
                  id="roomId"
                  value={roomIdSuper}
                  onChange={(e) => setRoomIdSuper(e.target.value)}
                >
                  <option value={undefined}>Select a Classroom</option>
                  {roomOptions.map((room) => (
                    <option value={room.id} key={room.id}>
                      {room.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        );
      }
      if (type === InviteModalType.SCHOOL) {
        const roomOptions = school?.rooms || [];
        return (
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              width: "100%",
            }}
            isRequired
          >
            <FormLabel htmlFor="roomId">Classroom</FormLabel>
            <Select
              id="roomId"
              value={roomIdSuper}
              onChange={(e) => setRoomIdSuper(e.target.value)}
            >
              {roomOptions.map((room) => (
                <option value={room.id} key={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
          </FormControl>
        );
      }

      if (type === InviteModalType.ROOM) {
        return null;
      }
    };
    switch (permissionType) {
      case PermissionType.ORG_ADMIN:
        // organizationId is defined, and that's all we need.
        return null;
      case PermissionType.SCHOOL_ADMIN:
        if (type === InviteModalType.ORGANIZATION) {
          // User is at organization level, adding a school admin.
          const schoolOptions = organization?.schools || [];
          return (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired
            >
              <FormLabel htmlFor="schoolId">School</FormLabel>
              <Select
                id="schoolId"
                value={schoolIdSuper}
                onChange={(e) => setSchoolIdSuper(e.target.value)}
              >
                {schoolOptions.map((school) => (
                  <option value={school.id} key={school.id}>
                    {school.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          );
        }
        if (type === InviteModalType.SCHOOL) {
          return null;
        }
        break;
      case PermissionType.ROOM_ADMIN:
        return caseForRoomLevel();
      case PermissionType.STUDENT:
        return caseForRoomLevel();
      default:
        return null;
    }
  };

  const { handleSubmit, register, watch } = useForm<SubmitData>({
    defaultValues: {
      gradeYear: undefined,
      email: "",
      permissionType: PermissionType.STUDENT,
      organizationId: organizationId,
      schoolId: schoolIdSuper || schoolId,
      roomId: roomIdSuper || roomId || roomOptions[0]?.id,
    },
    reValidateMode: "onBlur",
  });
  const email = watch("email");

  console.log("orgId", organizationId);
  console.log("schoolIdSuper", schoolIdSuper);
  console.log("roomIdSuper", roomIdSuper);

  const isDisabled = useMemo(() => {
    // Require email and permissionType
    console.log("permissionType", permissionType);
    if (!permissionType) {
      return true;
    }
    if (!email) {
      return true;
    }
    console.log("got here 1");
    if (permissionType === PermissionType.ROOM_ADMIN) {
      switch (type) {
        case InviteModalType.ROOM:
          return !roomId;
        case InviteModalType.SCHOOL:
          return !(roomId || roomIdSuper) || !(schoolId || schoolIdSuper);
        case InviteModalType.ORGANIZATION:
          return (
            !(roomId || roomIdSuper) ||
            !(schoolId || schoolIdSuper) ||
            !organizationId
          );
      }
    }
    console.log("got here 2");
    if (permissionType === PermissionType.SCHOOL_ADMIN) {
      switch (type) {
        case InviteModalType.SCHOOL:
          return !schoolId;
        case InviteModalType.ORGANIZATION:
          return !(schoolId || schoolIdSuper) || !organizationId;
      }
    }
    console.log("got here 3");
    if (permissionType === PermissionType.ORG_ADMIN) {
      return !organizationId;
    }
    console.log("got here 4");

    return false;
  }, [
    permissionType,
    email,
    roomId,
    schoolId,
    organizationId,
    type,
    roomIdSuper,
    schoolIdSuper,
  ]);
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
        {getExtraFieldsFromType()}
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
