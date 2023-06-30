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
import { GET_SCHOOL_BY_ID, getSchoolByIdQuery } from "@judie/data/queries";
import { useQuery } from "react-query";
import RoomRow from "../EntityRow/RoomRow";

const AdminSchool = ({ id }: { id: string }) => {
  const { data: schoolData } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, id],
    queryFn: () => getSchoolByIdQuery(id),
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
        {schoolData?.name}
      </Text>
      <Tabs size={"md"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {schoolData?.rooms?.length ? <Tab>Rooms</Tab> : null}
        </TabList>
        <TabPanels>
          {schoolData?.rooms?.length ? (
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
                {schoolData?.rooms.map((room) => (
                  <RoomRow key={room.id} room={room} />
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

export default AdminSchool;
