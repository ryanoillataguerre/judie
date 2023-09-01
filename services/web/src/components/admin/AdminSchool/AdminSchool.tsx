import {
  Button,
  HStack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import {
  GET_INVITES_FOR_SCHOOL,
  GET_SCHOOL_BY_ID,
  GET_USERS_FOR_SCHOOL,
  getInvitesForSchoolQuery,
  getSchoolByIdQuery,
  getUsersForSchoolQuery,
} from "@judie/data/queries";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import CreateRoomModal from "../CreateRoomModal";
import { PlusSquareIcon } from "@chakra-ui/icons";
import InvitesTable from "../tables/InvitesTable";
import { Invite, Room, User } from "@judie/data/types/api";
import UsersTable from "../tables/UsersTable";
import RoomsTable from "../tables/RoomsTable";
import EditableTitle from "../EditableTitle";
import { putSchoolMutation } from "@judie/data/mutations";

const AdminSchool = ({ id }: { id: string }) => {
  const { data: schoolData, refetch: refetchSchool } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, id],
    queryFn: () => getSchoolByIdQuery(id),
    enabled: !!id,
  });
  const { data: schoolUserData } = useQuery({
    queryKey: [GET_USERS_FOR_SCHOOL, id],
    queryFn: () => getUsersForSchoolQuery(id),
    enabled: !!id,
  });

  const { data: schoolInvitesData } = useQuery({
    queryKey: [GET_INVITES_FOR_SCHOOL, id],
    queryFn: () => getInvitesForSchoolQuery(id),
    enabled: !!id,
  });

  const [createRoomOpen, setCreateRoomOpen] = useState(false);

  const editSchoolMutation = useMutation({
    mutationFn: putSchoolMutation,
    onSuccess: () => {
      refetchSchool();
    },
  });

  return (
    <VStack
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "100%",
      }}
    >
      <CreateRoomModal
        isOpen={createRoomOpen}
        onClose={() => setCreateRoomOpen(false)}
        schoolId={schoolData?.id as string}
        organizationId={schoolData?.organizationId as string}
      />
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
        paddingLeft={"1rem"}
        paddingTop={"2rem"}
      >
        <EditableTitle
          title={schoolData?.name as string}
          onChange={(value) => {
            editSchoolMutation.mutate({
              schoolId: schoolData?.id as string,
              name: value,
            });
          }}
        />

        <Button
          size={"sm"}
          variant={"solid"}
          colorScheme="green"
          onClick={() => setCreateRoomOpen(true)}
        >
          <PlusSquareIcon marginRight={"0.3rem"} /> Create Room
        </Button>
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {schoolData?.rooms?.length ? <Tab>Rooms</Tab> : null}
          {schoolUserData?.length ? <Tab>Users</Tab> : null}
          {schoolInvitesData?.length ? <Tab>Invites</Tab> : null}
        </TabList>
        <TabPanels>
          <TabPanel>
            <RoomsTable rooms={schoolData?.rooms as Room[]} />
          </TabPanel>
          <TabPanel>
            <UsersTable users={schoolUserData as User[]} schoolId={id} />
          </TabPanel>
          <TabPanel>
            <InvitesTable
              invites={schoolInvitesData as Invite[]}
              schoolId={id}
            />
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminSchool;
