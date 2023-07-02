import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { CreatePermissionType } from "@judie/data/mutations";
import {
  Organization,
  Permission,
  PermissionType,
  Room,
  School,
} from "@judie/data/types/api";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Button/Button";
import useAuth from "@judie/hooks/useAuth";
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";

const PermissionRow = ({
  permission,
}: {
  permission: CreatePermissionType;
  editable?: boolean;
  onChange: (permission: CreatePermissionType) => void;
}) => {
  return (
    <Flex
      style={{
        width: "100%",
        padding: "0.5rem",
        backgroundColor: "white",
      }}
    >
      Hello
    </Flex>
  );
};

interface SubmitData {
  type: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}

const NewPermissionRow = ({
  setNewPermission,
  newPermission,
}: {
  setNewPermission: (perm: CreatePermissionType) => void;
  newPermission?: CreatePermissionType;
}) => {
  const auth = useAuth();
  const [type, setType] = useState<PermissionType>(PermissionType.STUDENT);
  const { organizations, schools, rooms } = useFlatAllEntities();
  const [organization, setOrganization] = useState<Organization>();
  const [school, setSchool] = useState<School>();
  const [room, setRoom] = useState<Room>();
  const { handleSubmit, register, reset, watch } = useForm<SubmitData>({
    defaultValues: {
      type,
      organizationId: undefined,
      schoolId: undefined,
      roomId: undefined,
    },
    reValidateMode: "onBlur",
  });
  const onSubmit: SubmitHandler<SubmitData> = ({
    type,
    organizationId,
    schoolId,
    roomId,
  }: SubmitData) => {
    try {
      setNewPermission({
        type,
        organizationId,
        schoolId,
        roomId,
      });
      // TODO: Validate permission has according ids attached for type
      // Add permission to array
    } catch (err) {}
  };

  useEffect(() => {
    const org = organizations?.find(
      (org) => org.id === watch("organizationId")
    );
    if (org) {
      setOrganization(org);
    }
  }, [watch("organizationId")]);

  useEffect(() => {
    const school = schools?.find((school) => school.id === watch("schoolId"));
    if (school) {
      setSchool(school);
    }
  }, [watch("schoolId")]);

  useEffect(() => {
    setOrganization(undefined);
    setSchool(undefined);
    setRoom(undefined);
    reset();
  }, [watch("type")]);

  return (
    <Flex
      style={{
        width: "100%",
        borderWidth: "0.5px",
        borderRadius: "0.5rem",
        padding: "1rem",
      }}
    >
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
            width: "100%",
          }}
        >
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
              {/* TODO Ryan: Make user-facing versions of these */}
              {Object.keys(PermissionType).map((key) => (
                <option value={key}>{key}</option>
              ))}
            </Select>
          </FormControl>
          {type === PermissionType.ORG_ADMIN ||
          type === PermissionType.STUDENT ? (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired={type === PermissionType.ORG_ADMIN}
            >
              <FormLabel htmlFor="organization">Organization</FormLabel>
              <Select id="organizationId" {...register("organizationId", {})}>
                {type !== PermissionType.ORG_ADMIN && (
                  <option key="none" value={undefined}>
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
          ) : null}
          {type === PermissionType.SCHOOL_ADMIN ||
          (type === PermissionType.STUDENT && organization) ? (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired={type === PermissionType.SCHOOL_ADMIN}
            >
              <FormLabel htmlFor="school">School</FormLabel>
              <Select id="schoolId" {...register("schoolId", {})}>
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
          ) : null}
          {type === PermissionType.ROOM_ADMIN ||
          (type === PermissionType.STUDENT && organization && school) ? (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired={type === PermissionType.ROOM_ADMIN}
            >
              <FormLabel htmlFor="room">Room</FormLabel>
              <Select id="roomId" {...register("roomId", {})}>
                {type !== PermissionType.ROOM_ADMIN && (
                  <option key="none" value={undefined}>
                    None
                  </option>
                )}
                {(type === PermissionType.ROOM_ADMIN
                  ? rooms
                  : school?.rooms
                )?.map((room) => (
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
              marginTop: "0.8rem",
            }}
            colorScheme="green"
            variant={"solid"}
            loading={false}
            label="+ Add"
            type="button"
          />
        </Flex>
      </form>
    </Flex>
  );
};

const CreatePermissionWidget = () => {
  const [newPermission, setNewPermission] = useState<CreatePermissionType>();

  return (
    <VStack
      style={{
        flexDirection: "column",
        width: "100%",
      }}
      spacing={"1rem"}
    >
      <Flex
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.5rem",
          borderWidth: "0.5px",
          borderRadius: "0.5rem",
        }}
        borderColor={"gray.400"}
        backgroundColor="white"
        textColor={"black"}
        cursor={"pointer"}
        onClick={() => setNewPermission({} as CreatePermissionType)}
      >
        + Add a permission
      </Flex>
      {newPermission ? (
        <NewPermissionRow
          setNewPermission={setNewPermission}
          newPermission={newPermission}
        />
      ) : null}
    </VStack>
  );
};

const PermissionsWidget = ({
  onChangePermissions,
}: {
  onChangePermissions: (permissions: CreatePermissionType[]) => void;
}) => {
  const [permissions, setPermissions] = useState<CreatePermissionType[]>([]);
  return (
    <Flex
      style={{
        width: "100%",
        padding: "1rem",
        borderWidth: "0.5px",
        borderRadius: "0.5rem",
      }}
    >
      {permissions.map((permission) => (
        <PermissionRow
          permission={permission}
          onChange={(permission) => {
            // TODO: Update permission in permissions array and do mutation
            console.log("permission changed", permission);
          }}
        />
      ))}
      <CreatePermissionWidget />
    </Flex>
  );
};

export default PermissionsWidget;
