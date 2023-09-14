import {
  Button,
  HStack,
  Text,
  VStack,
  useBreakpointValue,
  useColorMode,
  useToken,
} from "@chakra-ui/react";
import { GET_USER_FOLDERS, getUserFoldersQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";
import { BsArrowRight } from "react-icons/bs";
import { useQuery } from "react-query";
import FolderCard from "./FolderCard";

const DashboardFoldersList = () => {
  const auth = useAuth();
  const router = useRouter();
  const foldersQuery = useQuery({
    queryKey: [GET_USER_FOLDERS, auth?.userData?.id],
    queryFn: getUserFoldersQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });

  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);

  const numFoldersShown = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 4,
  });
  const renderedFolders = foldersQuery.data?.slice(0, numFoldersShown);

  return renderedFolders?.length ? (
    <VStack w={"100%"}>
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100%"}
        marginTop={"1.5rem"}
        marginBottom={"1rem"}
      >
        <Text variant={"subheaderDetail"}>Folders</Text>
        <Button
          variant={"ghost"}
          size={"sm"}
          type={"button"}
          onClick={() => {
            router.push("/folders");
          }}
        >
          <Text color={colorKey}>See All</Text>
          <BsArrowRight
            color={purpleHexCode}
            size={16}
            style={{
              marginLeft: "0.2rem",
            }}
          />
        </Button>
      </HStack>
      <HStack
        w={"100%"}
        spacing={"0.5rem"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        wrap={"wrap"}
      >
        {renderedFolders?.map((folder) => {
          return (
            <FolderCard
              key={folder.id}
              id={folder.id}
              title={folder.userTitle}
              chatCount={folder?._count?.chats}
            />
          );
        })}
      </HStack>
    </VStack>
  ) : (
    <></>
  );
};

export default DashboardFoldersList;
