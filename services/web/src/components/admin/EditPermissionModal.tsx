import {
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
  createPermissionMutation,
  putPermissionMutation as editPermissionMutation,
} from "@judie/data/mutations";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import {
  GET_ORG_BY_ID,
  GET_PERMISSIONS_BY_ID,
  getOrgByIdQuery,
  getPermissionsByIdQuery,
  getSchoolByIdQuery,
} from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import {
  Organization,
  Permission,
  PermissionType,
  Room,
  School,
} from "@judie/data/types/api";
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";
import { HTTPResponseError } from "@judie/data/baseFetch";

interface SubmitData {
  type: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}

type CreatePermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  permissionId: string;
  permission: Permission;
  selectedUserId: string;
  userName: string;
};

const EditPermissionModal = ({
  isOpen,
  onClose,
  permissionId,
  permission,
  selectedUserId,
  userName,
}: CreatePermissionModalProps) => {
  const [type, setType] = useState<PermissionType>(permission.type);
  const [organizationId, setOrganizationId] = useState<string>(
    permission.organizationId
  );
  const [schoolId, setSchoolId] = useState<string>(permission.schoolId);
  const [roomId, setRoomId] = useState<string>(permission.roomId);

  const { refreshEntities } = useAuth();
  const [success, setSuccess] = useState(false);
  const editPermission = useMutation({
    mutationFn: editPermissionMutation,
    onSuccess: () => {
      setSuccess(true);
    },
  });
  const [organization, setOrganization] = useState<Organization | undefined>(
    permission.organization
  );
  const [school, setSchool] = useState<School>();
  const [room, setRoom] = useState<Room>();
  const { organizations, schools, rooms } = useFlatAllEntities();
  const toast = useToast();

  const { refetch } = useQuery({
    queryKey: [GET_PERMISSIONS_BY_ID, selectedUserId],
    queryFn: () => getPermissionsByIdQuery(selectedUserId),
    enabled: !!selectedUserId,
  });

  const { handleSubmit, register, reset } = useForm<SubmitData>({
    defaultValues: {
      type: permission.type,
      organizationId: permission.organizationId,
      schoolId: permission.schoolId ?? "None",
      roomId: permission.roomId ?? "None",
    },
    reValidateMode: "onBlur",
  });

  const onSubmit: SubmitHandler<SubmitData> = async ({
    type,
    organizationId,
    schoolId,
    roomId,
  }: SubmitData) => {
    try {
      await editPermission.mutateAsync({
        selectedUserId,
        permissionId,
        type,
        schoolId,
        organizationId,
        roomId,
      });
      onClose();
      refetch();
      reset();
    } catch (err) {}
  };

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
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
            Edit the permission for {userName}
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
                  {...register("type")}
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
                    <option key="none" defaultChecked value={undefined}>
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
                  {...register("schoolId")}
                  value={schoolId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSchoolId(e.target.value);
                  }}
                >
                  {type !== PermissionType.SCHOOL_ADMIN && (
                    <option key="none" value={undefined}>
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
                  {...register("roomId")}
                  value={roomId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setRoomId(e.target.value);
                  }}
                >
                  {type !== PermissionType.ROOM_ADMIN && (
                    <option key="none" value={undefined}>
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

              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                colorScheme="green"
                variant={"solid"}
                loading={editPermission.isLoading}
                label="Update Permission"
                type="submit"
              />
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditPermissionModal;
