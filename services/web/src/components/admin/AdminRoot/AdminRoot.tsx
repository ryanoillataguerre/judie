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
  Organization,
  PermissionType,
  Room,
  School,
} from "@judie/data/types/api";
import useAuth, { isPermissionTypeAdmin } from "@judie/hooks/useAuth";
import { useMemo } from "react";
import OrgRow from "../EntityRow/OrgRow";
import SchoolRow from "../EntityRow/SchoolRow";
import RoomRow from "../EntityRow/RoomRow";
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";

const AdminRoot = () => {
  const { userData } = useAuth();
  const { organizations, schools, rooms } = useFlatAllEntities();

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
          paddingLeft: "1rem",
        }}
      >
        Admin
      </Text>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          <Tab>Your Organizations</Tab>
          <Tab>Your Schools</Tab>
          <Tab>Your Rooms</Tab>
        </TabList>
        <TabPanels>
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
              {organizations?.map((org) => (
                <OrgRow key={org.id} org={org} />
              ))}
            </VStack>
          </TabPanel>
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
              {schools?.map((school) => (
                <SchoolRow key={school.id} school={school} />
              ))}
            </VStack>
          </TabPanel>
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
              {rooms?.map((room) => (
                <RoomRow key={room.id} room={room} />
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminRoot;