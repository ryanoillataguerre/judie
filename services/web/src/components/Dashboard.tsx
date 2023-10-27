import { HStack, Text, Toast, VStack, useToast } from "@chakra-ui/react";
import DashboardHeader from "./DashboardHeader";
import useAuth from "@judie/hooks/useAuth";
import ChatsTable from "./ChatsTable";
import { useMutation, useQuery } from "react-query";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import DashboardFoldersList from "./DashboardFoldersList";
import OnboardingModal from "./OnboardingModal";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createChatMutation } from "@judie/data/mutations";

const Dashboard = () => {
  const { userData, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const { data: chatsData, isLoading: isGetChatsLoading } = useQuery(
    [GET_USER_CHATS, userData?.id],
    {
      queryFn: getUserChatsQuery,
      staleTime: 60000,
      enabled: !!userData?.id,
    }
  );

  const { refetch } = useQuery([GET_USER_CHATS, userData?.id], {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
    enabled: false,
  });

  const createChat = useMutation({
    mutationFn: createChatMutation,
    onSuccess: ({ id }) => {
      refetch();
      router.push({
        pathname: "/chat",
        query: {
          id,
        },
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error creating chat",
        description: "Sorry, there was an error creating your chat",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  return (
    <VStack
      paddingX={"2rem"}
      paddingY={"1rem"}
      h={"100%"}
      w={"100%"}
      overflowY={"auto"}
    >
      {!isLoading && <OnboardingModal />}
      {/* Dashboard Header */}
      <DashboardHeader
        onCreateChat={() => createChat.mutate({})}
        isLoading={createChat.isLoading}
      />
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
        <Text variant={"subheaderDetail"}>Chats</Text>
      </HStack>
      <ChatsTable chats={chatsData} isLoading={isGetChatsLoading} />
    </VStack>
  );
};

export default Dashboard;
