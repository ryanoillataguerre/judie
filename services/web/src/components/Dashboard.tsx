import { HStack, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import DashboardHeader from "./DashboardHeader";
import useAuth from "@judie/hooks/useAuth";
import ChatsTable from "./ChatsTable";
import { useQuery } from "react-query";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import DashboardFoldersList from "./DashboardFoldersList";

const Dashboard = () => {
  const { userData } = useAuth();

  const xPadding = useBreakpointValue({
    base: "2rem",
    md: "2rem",
  });
  const { data: chatsData, isLoading: isGetChatsLoading } = useQuery(
    [GET_USER_CHATS, userData?.id],
    {
      queryFn: getUserChatsQuery,
      staleTime: 60000,
      enabled: !!userData?.id,
    }
  );
  return (
    <VStack
      paddingX={xPadding}
      paddingY={"1rem"}
      h={"100%"}
      w={"100%"}
      overflowY={"scroll"}
    >
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
      <DashboardFoldersList />
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
      <ChatsTable chats={chatsData} isLoading={isGetChatsLoading} />
    </VStack>
  );
};

export default Dashboard;
