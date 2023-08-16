import {
  Button,
  HStack,
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
import UsersTable from "../tables/UsersTable";
import { Invite, User } from "@judie/data/types/api";
import InvitesTable from "../tables/InvitesTable";
import { useState } from "react";
import DeleteRoomModal from "../DeleteRoomModal";

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
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
      >
        <Text
          style={{
            marginTop: "2rem",
            fontSize: "2rem",
          }}
        >
          {roomData?.name}
        </Text>
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {roomUserData?.length ? <Tab>Users</Tab> : null}
          {roomInvitesData?.length ? <Tab>Invites</Tab> : null}
        </TabList>
        <TabPanels>
          <TabPanel>
            <UsersTable roomId={id} users={roomUserData as User[]} />
          </TabPanel>
          <TabPanel>
            <InvitesTable roomId={id} invites={roomInvitesData as Invite[]} />
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminRoom;
