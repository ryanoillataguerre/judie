import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  GET_INVITES_FOR_ROOM,
  GET_ROOM_BY_ID,
  GET_USERS_FOR_ROOM,
  getInvitesForRoomQuery,
  getRoomByIdQuery,
  getUsersForRoomQuery,
} from "@judie/data/queries";
import { useQuery } from "react-query";
import UserRow from "../EntityRow/UserRow";
import InviteRow from "../EntityRow/InviteRow";

const AdminRoom = ({ id }: { id: string }) => {
  const { data: roomData } = useQuery({
    queryKey: [GET_ROOM_BY_ID, id],
    queryFn: () => getRoomByIdQuery(id),
    enabled: !!id,
  });
  const { data: roomUserData } = useQuery({
    queryKey: [GET_USERS_FOR_ROOM, id],
    queryFn: () => getUsersForRoomQuery(id),
    enabled: !!id,
  });
  const { data: roomInvitesData } = useQuery({
    queryKey: [GET_INVITES_FOR_ROOM, id],
    queryFn: () => getInvitesForRoomQuery(id),
    enabled: !!id,
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
      <Text
        style={{
          marginTop: "2rem",
          fontSize: "2rem",
        }}
      >
        {roomData?.name}
      </Text>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {roomUserData?.length ? <Tab>Users</Tab> : null}
        </TabList>
        <TabPanels>
          {roomUserData?.length ? (
            <TabPanel>
              <VStack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                spacing={"1rem"}
              >
                {roomUserData?.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
          {roomInvitesData?.length ? (
            <TabPanel>
              <VStack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                spacing={"1rem"}
              >
                {roomInvitesData.map((invite) => (
                  <InviteRow key={invite.id} invite={invite} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminRoom;
