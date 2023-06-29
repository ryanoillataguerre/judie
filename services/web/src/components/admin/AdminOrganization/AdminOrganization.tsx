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
import { GET_ORG_BY_ID, getOrgByIdQuery } from "@judie/data/queries";
import { PermissionType } from "@judie/data/types/api";
import useAuth, { isPermissionTypeAdmin } from "@judie/hooks/useAuth";
import { useMemo } from "react";
import { useQuery } from "react-query";

const AdminOrganization = ({ id }: { id: string }) => {
  const { userData } = useAuth();
  const adminPermissions = useMemo(
    () =>
      userData?.permissions?.filter((permission) =>
        isPermissionTypeAdmin(permission.type)
      ),
    [userData?.permissions]
  );

  const { data: organizationData } = useQuery({
    queryKey: [GET_ORG_BY_ID, id],
    queryFn: () => getOrgByIdQuery(id),
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
        Admin
      </Text>
      <Tabs size={"md"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {organizationData?.schools?.length ? <Tab>Schools</Tab> : null}
          {organizationData?.rooms?.length ? <Tab>Rooms</Tab> : null}
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
