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
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";
import { PlusSquareIcon } from "@chakra-ui/icons";
import CreateOrgModal from "../CreateOrgModal";
import { useQuery } from "react-query";
import {
  GET_USERS_FOR_ADMIN_USER,
  getUsersForAdminUserQuery,
} from "@judie/data/queries";
import OrganizationsTable from "../tables/OrganizationsTable";
import SchoolsTable from "../tables/SchoolsTable";
import RoomsTable from "../tables/RoomsTable";
import UsersTable from "../tables/UsersTable";
import { useRouter } from "next/router";

const AdminRoot = () => {
  const { userData, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
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
        {userData?.role === UserRole.JUDIE ? (
          <CreateOrgModal
            isOpen={createOrgModalOpen}
            onClose={() => setCreateOrgModalOpen(false)}
          />
        ) : null}

        <Text
          style={{
            fontSize: "2rem",
          }}
        >
          Admin
        </Text>
        <HStack>
          {userData?.role === UserRole.JUDIE ? (
            <Button
              size={"sm"}
              variant={"secondary"}
              type={"button"}
              onClick={() => router.push("/admin/super-usage")}
            >
              <Text variant={"button"}>Judie Admin - Usage</Text>
            </Button>
          ) : null}
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
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          <Tab>Organizations</Tab>
          <Tab>Schools</Tab>
          <Tab>Classes</Tab>
          <Tab>Users</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={{ base: "16px 0", md: "16px 16px" }}>
            <OrganizationsTable
              organizations={organizations as Organization[]}
            />
          </TabPanel>
          <TabPanel p={{ base: "16px 0", md: "16px 16px" }}>
            <SchoolsTable schools={schools} />
          </TabPanel>
          <TabPanel p={{ base: "16px 0", md: "16px 16px" }}>
            <RoomsTable rooms={rooms} />
          </TabPanel>
          <TabPanel p={{ base: "16px 0", md: "16px 16px" }}>
            <UsersTable users={users as User[]} loading={isLoading} />
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminRoot;
