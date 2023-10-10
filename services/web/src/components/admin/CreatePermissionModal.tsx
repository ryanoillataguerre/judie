import {
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { createPermissionMutation } from "@judie/data/mutations";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import {
  GET_PERMISSIONS_BY_ID,
  getPermissionsByIdQuery,
} from "@judie/data/queries";
import {
  Organization,
  PermissionType,
  Room,
  School,
} from "@judie/data/types/api";
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";

interface SubmitData {
  type: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}

type CreatePermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
};

const CreatePermissionModal = ({
  isOpen,
  onClose,
  userName,
  userId,
}: CreatePermissionModalProps) => {
  const [type, setType] = useState<PermissionType>(PermissionType.STUDENT);
  const [organizationId, setOrganizationId] = useState<string>();
  const [schoolId, setSchoolId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();

  const toast = useToast();
  const createPermission = useMutation({
    mutationFn: createPermissionMutation,
    onSuccess: () => {
      toast({
        title: "Permission created",
        description: `Permission created for ${userName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  const [organization, setOrganization] = useState<Organization>();
  const [school, setSchool] = useState<School>();
  const [room, setRoom] = useState<Room>();
  const { organizations, schools, rooms } = useFlatAllEntities();

  const { refetch } = useQuery({
    queryKey: [GET_PERMISSIONS_BY_ID, userId],
    queryFn: () => getPermissionsByIdQuery(userId),
    enabled: !!userId,
  });

  const { handleSubmit, register, reset, resetField } = useForm<SubmitData>({
    defaultValues: {
      type: PermissionType.STUDENT,
      organizationId: "None",
      schoolId: "None",
      roomId: "None",
    },
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    if (organizationId) {
      const newOrg = organizations?.find((org) => org.id === organizationId);
      setOrganization(newOrg);
    } else {
      setOrganization(undefined);
    }
  }, [organizationId, setOrganization, organizations]);
  useEffect(() => {
    if (schoolId) {
      const newSchool = schools?.find((sch) => sch.id === schoolId);
      setSchool(newSchool);
    } else {
      setSchool(undefined);
    }
  }, [schoolId, setSchool, schools]);
  useEffect(() => {
    if (roomId) {
      const newRoom = rooms?.find((rm) => rm.id === roomId);
      setRoom(newRoom);
    } else {
      setRoom(undefined);
    }
  }, [roomId, setRoom, rooms]);

  useEffect(() => {
    if (organizationId === "None") {
      resetField("schoolId", { defaultValue: "None" });
      resetField("roomId", { defaultValue: "None" });
    }
  }, [organizationId, resetField]);

  useEffect(() => {
    if (schoolId === "None") {
      resetField("roomId", { defaultValue: "None" });
    }
  }, [schoolId, resetField]);

  const clearSelections = useCallback(() => {
    setOrganizationId("None");
    setSchoolId("None");
    setRoomId("None");
    setOrganization(undefined);
    reset();
  }, [setOrganizationId, setSchoolId, setRoomId, setOrganization, reset]);

  const onSubmit: SubmitHandler<SubmitData> = async ({
    type,
    organizationId,
    schoolId = "None",
    roomId = "None",
  }: SubmitData) => {
    try {
      await createPermission.mutateAsync({
        userId,
        type,
        schoolId,
        organizationId,
        roomId,
      });

      clearSelections();
      onClose();
      refetch();
      reset();
    } catch (err) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        clearSelections();
        onClose();
      }}
    >
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
            Add a new permission for {userName}
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
                Choose from the available spaces below
              </Text>

              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  width: "100%",
                }}
                isRequired
              >
                <FormLabel htmlFor="permissionType">Permission Type</FormLabel>
                <Select
                  id="type"
                  {...register("type", {})}
                  value={type}
                  onChange={(e) => setType(e.target.value as PermissionType)}
                >
                  {Object.keys(PermissionType).map((key) => (
                    <option value={key} key={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  width: "100%",
                }}
                isRequired={type === PermissionType.ORG_ADMIN}
              >
                <FormLabel htmlFor="organization">Organization</FormLabel>
                <Select
                  id="organizationId"
                  {...register("organizationId", {})}
                  value={organizationId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setOrganizationId(e.target.value);
                  }}
                >
                  {type !== PermissionType.ORG_ADMIN && (
                    <option key="none" defaultChecked value={"None"}>
                      None
                    </option>
                  )}
                  {organizations?.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {(type === PermissionType.ROOM_ADMIN ||
                type === PermissionType.SCHOOL_ADMIN ||
                type === PermissionType.STUDENT) &&
              organization ? (
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                  }}
                  isRequired={type === PermissionType.SCHOOL_ADMIN}
                >
                  <FormLabel htmlFor="school">School</FormLabel>
                  <Select
                    id="schoolId"
                    {...register("schoolId", {})}
                    value={schoolId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setSchoolId(e.target.value);
                    }}
                  >
                    {type !== PermissionType.SCHOOL_ADMIN && (
                      <option key="none" value={"None"}>
                        None
                      </option>
                    )}
                    {organization?.schools?.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              {(type === PermissionType.ROOM_ADMIN ||
                type === PermissionType.STUDENT) &&
              organization &&
              school ? (
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                  }}
                  isRequired={type === PermissionType.ROOM_ADMIN}
                >
                  <FormLabel htmlFor="room">Room</FormLabel>
                  <Select
                    id="roomId"
                    {...register("roomId", {})}
                    value={roomId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setRoomId(e.target.value);
                    }}
                  >
                    {type !== PermissionType.ROOM_ADMIN && (
                      <option key="none" value={"None"}>
                        None
                      </option>
                    )}
                    {school?.rooms?.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                colorScheme="green"
                variant={"solid"}
                loading={createPermission.isLoading}
                label="Create Permission"
                type="submit"
              />
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePermissionModal;
