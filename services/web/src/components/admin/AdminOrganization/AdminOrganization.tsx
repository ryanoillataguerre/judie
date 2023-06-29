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
import { PermissionType } from "@judie/data/types/api";
import useAuth, { isPermissionTypeAdmin } from "@judie/hooks/useAuth";
import { useMemo } from "react";
import OrgRow from "../EntityRows/OrgRow";

const AdminOrganization = () => {
  const { userData } = useAuth();
  const adminPermissions = useMemo(
    () =>
      userData?.permissions?.filter((permission) =>
        isPermissionTypeAdmin(permission.type)
      ),
    [userData?.permissions]
  );
  const organizations = useMemo(() => {
    if (!userData) return [];
    if (!adminPermissions?.length) return [];
    for (const permission of adminPermissions) {
      if (permission.type === PermissionType.ORG_ADMIN) {
        return [
          ...(userData?.organizations || []),
          ...(userData?.createdOrganizations || []),
        ];
      }
    }
  }, [userData, adminPermissions]);
  console.log("organizations", organizations);

  const schools = useMemo(() => {
    if (!userData) return [];
    if (!adminPermissions?.length) return [];
    for (const permission of adminPermissions) {
      if (permission.type === PermissionType.SCHOOL_ADMIN) {
        return userData?.schools;
      }
    }
  }, [userData, adminPermissions]);

  const rooms = useMemo(() => {
    if (!userData) return [];
    if (!adminPermissions?.length) return [];
    for (const permission of adminPermissions) {
      if (permission.type === PermissionType.ROOM_ADMIN) {
        return userData?.rooms;
      }
    }
  }, [userData, adminPermissions]);

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
        Admin
      </Text>
      <Tabs size={"md"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {organizations?.length ? <Tab>Your Organizations</Tab> : null}
          {/* <Tab>Organizations</Tab> */}
          {schools?.length ? <Tab>Your Schools</Tab> : null}
          {/* <Tab>Schools</Tab> */}
          {rooms?.length ? <Tab>Your Rooms</Tab> : null}
          {/* <Tab>Rooms</Tab> */}
        </TabList>
        <TabPanels>
          {organizations?.length ? (
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
                {organizations.map((org) => (
                  <OrgRow key={org.id} org={org} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
          {schools?.length ? <TabPanel>schools</TabPanel> : null}
          {rooms?.length ? <TabPanel>rooms</TabPanel> : null}
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminOrganization;
