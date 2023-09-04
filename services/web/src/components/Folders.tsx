import {
  Center,
  HStack,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { GET_USER_FOLDERS, getUserFoldersQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import { useQuery } from "react-query";
import FolderCard from "./FolderCard";

const Folders = () => {
  const auth = useAuth();
  const foldersQuery = useQuery({
    queryKey: [GET_USER_FOLDERS, auth?.userData?.id],
    queryFn: getUserFoldersQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });
  const gridSpacing = useBreakpointValue({
    base: "0.5rem",
    md: "1rem",
  });
  return (
    <VStack
      paddingX={"2rem"}
      paddingY={"1rem"}
      h={"100%"}
      w={"100%"}
      overflowY={"scroll"}
      pt={"3rem"}
    >
      <VStack width={"100%"} alignItems={"flex-start"}>
        <Text variant={"header"}>Your Folders</Text>
        <Text variant={"headerDetail"}>
          Click into a folder to view all of the chats you&apos;ve sorted into
          it
        </Text>
      </VStack>
      <HStack
        w={"100%"}
        spacing={gridSpacing}
        alignItems={"center"}
        justifyContent={"flex-start"}
        wrap={"wrap"}
        mt={"1.5rem"}
      >
        {foldersQuery.isLoading ? (
          <Center w={"100%"} h={"100vh"}>
            <Spinner />
          </Center>
        ) : (
          foldersQuery?.data?.map((folder) => {
            return (
              <FolderCard
                key={folder.id}
                id={folder.id}
                title={folder.userTitle}
                chatCount={folder?._count?.chats}
              />
            );
          })
        )}
      </HStack>
    </VStack>
  );
};

export default Folders;
