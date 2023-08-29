import {
  Button,
  Center,
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
import { HiMiniFolderOpen } from "react-icons/hi2";
import { useQuery } from "react-query";

export const FolderCard = ({
  title,
  chatCount,
}: {
  title?: string | null;
  chatCount?: number;
}) => {
  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);
  return (
    <VStack
      h={"9rem"}
      w={"100%"}
      maxW={"16rem"}
      borderColor={"gray.200"}
      borderRadius={".5rem"}
      borderWidth={"1px"}
      padding={"1rem"}
      alignItems={"flex-start"}
      _hover={{
        bg: colorMode.colorMode === "dark" ? "#676767" : "#D3D3D3",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Center borderRadius={"0.5rem"} padding={"0.5rem"} bgColor={"white"}>
        <HiMiniFolderOpen size={24} color={purpleHexCode} />
      </Center>
      <Text variant={"title"}>{title}</Text>
      {chatCount ? (
        <Text variant={"detail"}>{chatCount} chats</Text>
      ) : (
        <Text variant={"detail"}>No chats</Text>
      )}
    </VStack>
  );
};

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

  return (
    <VStack w={"100%"}>
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100%"}
        marginTop={"1.5rem"}
        marginBottom={"1rem"}
      >
        <Text variant={"subheader"}>Folders</Text>
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
              title={folder.userTitle}
              chatCount={folder?._count?.chats}
            />
          );
        })}
      </HStack>
    </VStack>
  );
};

export default DashboardFoldersList;
