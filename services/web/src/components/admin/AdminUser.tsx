import {
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GET_USER_BY_ID, getUserByIdQuery } from "@judie/data/queries";
import { useQuery } from "react-query";
import UserUsage from "./UserUsage";

const AdminUser = ({ id }: { id: string }) => {
  const { data: userData } = useQuery({
    queryKey: [GET_USER_BY_ID, id],
    queryFn: () => getUserByIdQuery(id),
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
        {userData?.email}
      </Text>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>Usage</TabList>
        <TabPanels>
          <TabPanel>
            <UserUsage id={id} />
          </TabPanel>
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminUser;
