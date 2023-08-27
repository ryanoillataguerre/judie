import { HStack, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import DashboardHeader from "./DashboardHeader";
import useAuth from "@judie/hooks/useAuth";
import ChatsTable from "./ChatsTable";

const Dashboard = () => {
  const { userData } = useAuth();

  const xPadding = useBreakpointValue({
    base: "2rem",
    md: "2rem",
  });
  return (
    <VStack paddingX={xPadding} paddingY={"1rem"} maxH={"100%"} w={"100%"}>
      {/* Dashboard Header */}
      <DashboardHeader />
      {/* Title */}
      <VStack width={"100%"} alignItems={"flex-start"}>
        <Text variant={"header"}>👋 Hi {userData?.firstName || "there"}</Text>
        <Text variant={"headerDetail"}>
          Manage all your studies in one place
        </Text>
      </VStack>
      {/* Folders section */}
      {/* Chats list (scrollable container) */}
      <HStack
        justifyContent={"flex-start"}
        alignItems={"center"}
        w={"100%"}
        marginTop={"1.5rem"}
        marginBottom={"1rem"}
      >
        <Text variant={"subheader"}>Chats</Text>
      </HStack>
      <ChatsTable />
    </VStack>
  );
};

export default Dashboard;
