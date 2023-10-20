import {
  Box,
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
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";

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

  const router = useRouter();

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
        paddingTop={"2rem"}
      >
        <HStack paddingRight={"1rem"}>
          <Box minW={"20px"}>
            <BsArrowLeft
              size={20}
              style={{
                margin: "0 1rem",
              }}
              onClick={() => router.back()}
              cursor={"pointer"}
            />
          </Box>
          {schoolData && (
            <EditableTitle
              title={schoolData?.name as string}
              onChange={(value) => {
                value = value.trim();
                if (!value || value.length < 1) return;
                if (value === schoolData?.name) return;
                editSchoolMutation.mutate({
                  schoolId: schoolData?.id as string,
                  name: value,
                });
              }}
            />
          )}
        </HStack>

        <Button
          variant={"solid"}
          colorScheme="green"
          onClick={() => setCreateRoomOpen(true)}
        >
          <PlusSquareIcon marginRight={"0.3rem"} /> Create Class
        </Button>
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {schoolData?.rooms?.length ? <Tab>Classes</Tab> : null}
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
