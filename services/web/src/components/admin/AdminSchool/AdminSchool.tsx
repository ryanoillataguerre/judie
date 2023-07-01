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
import { GET_SCHOOL_BY_ID, getSchoolByIdQuery } from "@judie/data/queries";
import { useQuery } from "react-query";
import RoomRow from "../EntityRow/RoomRow";
import { useState } from "react";
import CreateRoomModal from "../CreateRoomModal";
import { PlusSquareIcon } from "@chakra-ui/icons";

const AdminSchool = ({ id }: { id: string }) => {
  const { data: schoolData } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, id],
    queryFn: () => getSchoolByIdQuery(id),
    enabled: !!id,
  });

  const [createRoomOpen, setCreateRoomOpen] = useState(false);

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
      <CreateRoomModal
        isOpen={createRoomOpen}
        onClose={() => setCreateRoomOpen(false)}
        schoolId={schoolData?.id as string}
        organizationId={schoolData?.organizationId as string}
      />
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
        paddingLeft={"1rem"}
        paddingTop={"2rem"}
      >
        <Text
          style={{
            fontSize: "2rem",
          }}
        >
          {schoolData?.name}
        </Text>
        <Button
          size={"sm"}
          variant={"solid"}
          colorScheme="green"
          onClick={() => setCreateRoomOpen(true)}
        >
          <PlusSquareIcon marginRight={"0.3rem"} /> Create Room
        </Button>
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
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
