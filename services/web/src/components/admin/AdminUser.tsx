import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Flex,
  Box,
} from "@chakra-ui/react";
import {
  GET_PERMISSIONS_BY_ID,
  GET_USER_BY_ID,
  getPermissionsByIdQuery,
  getUserByIdQuery,
} from "@judie/data/queries";
import { useQuery } from "react-query";
import UserUsage from "./UserUsage";
import PermissionsTable from "./tables/PermissionsTable";

const AdminUser = ({ id }: { id: string }) => {
  const { data: userData } = useQuery({
    queryKey: [GET_USER_BY_ID, id],
    queryFn: () => getUserByIdQuery(id),
    enabled: !!id,
  });

  const { data: permissionData } = useQuery({
    queryKey: [GET_PERMISSIONS_BY_ID, id],
    queryFn: () => getPermissionsByIdQuery(id),
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
      <Flex direction={"column"}>
        <Text
          style={{
            marginTop: "2rem",
            fontSize: "2rem",
          }}
        >
          {userData?.email}
        </Text>
        <Text>
          Name:{" "}
          <Box fontSize={"20px"} as={"span"}>
            {userData?.firstName} {userData?.lastName}
          </Box>
        </Text>
      </Flex>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          <Tab>Usage</Tab>
          <Tab>Permissions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={{ base: "16px 0", md: "16px 0px" }}>
            <UserUsage id={id} />
          </TabPanel>
          <TabPanel
            p={{ base: "16px 0", md: "16px 0px" }}
            position={"relative"}
          >
            {permissionData && userData && (
              <PermissionsTable
                permissions={permissionData}
                userName={`${userData?.firstName} ${userData?.lastName}`}
                userId={userData?.id}
              />
            )}
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminUser;
