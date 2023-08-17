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
import { Organization, School, User, UserRole } from "@judie/data/types/api";
import useAuth from "@judie/hooks/useAuth";
import { useEffect, useState } from "react";
import OrgRow from "../EntityRow/OrgRow";
import SchoolRow from "../EntityRow/SchoolRow";
import RoomRow from "../EntityRow/RoomRow";
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";
import { PlusSquareIcon } from "@chakra-ui/icons";
import CreateOrgModal from "../CreateOrgModal";
import { useQuery } from "react-query";
import {
  GET_USERS_FOR_ADMIN_USER,
  getUsersForAdminUserQuery,
} from "@judie/data/queries";
import UserRow from "../EntityRow/UserRow";
import OrganizationsTable from "../tables/OrganizationsTable";
import SchoolsTable from "../tables/SchoolsTable";
import RoomsTable from "../tables/RoomsTable";
import UsersTable from "../tables/UsersTable";

const AdminRoot = () => {
  const { userData } = useAuth();
  const { organizations, schools, rooms } = useFlatAllEntities();

  const [displayCreateOrg, setDisplayCreateOrg] = useState(false);
  const [createOrgModalOpen, setCreateOrgModalOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: [GET_USERS_FOR_ADMIN_USER, userData?.id],
    queryFn: getUsersForAdminUserQuery,
  });

  useEffect(() => {
    if (userData?.role === UserRole.JUDIE) {
      setDisplayCreateOrg(true);
    }
  }, [userData, setDisplayCreateOrg]);
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
        paddingLeft={"1rem"}
        paddingTop={"2rem"}
      >
        <CreateOrgModal
          isOpen={createOrgModalOpen}
          onClose={() => setCreateOrgModalOpen(false)}
        />
        <Text
          style={{
            fontSize: "2rem",
          }}
        >
          Admin
        </Text>
        {displayCreateOrg ? (
          <Button
            size={"sm"}
            variant={"solid"}
            colorScheme="green"
            onClick={() => setCreateOrgModalOpen(true)}
          >
            <PlusSquareIcon marginRight={"0.3rem"} /> Create Organization
          </Button>
        ) : null}
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          <Tab>Your Organizations</Tab>
          <Tab>Your Schools</Tab>
          <Tab>Your Rooms</Tab>
          <Tab>Your Users</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OrganizationsTable
              organizations={organizations as Organization[]}
            />
          </TabPanel>
          <TabPanel>
            <SchoolsTable schools={schools} />
          </TabPanel>
          <TabPanel>
            <RoomsTable rooms={rooms} />
          </TabPanel>
          <TabPanel>
            <UsersTable users={users as User[]} loading={isLoading} />
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminRoot;
