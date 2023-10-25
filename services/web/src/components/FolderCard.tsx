import { Center, Text, VStack, useColorMode, useToken } from "@chakra-ui/react";
import { getTopicEmoji } from "@judie/utils/topicEmoji";
import { useRouter } from "next/router";
import { HiMiniFolderOpen } from "react-icons/hi2";

export const getIconForSubject = ({
  defaultColor,
  title,
}: {
  defaultColor?: string;
  title?: string | null;
}) => {
  if (!title) {
    return <HiMiniFolderOpen size={24} color={defaultColor} />;
  }
  const emoji = getTopicEmoji(title);
  if (emoji && emoji !== "📚") {
    return <Text fontSize={"1rem"}>{emoji}</Text>;
  }
  return <HiMiniFolderOpen size={24} color={defaultColor} />;
};

const FolderCard = ({
  id,
  title,
  chatCount,
}: {
  id: string;
  title?: string | null;
  chatCount?: number;
}) => {
  const router = useRouter();
  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);
  return (
    <VStack
      h={"100%"}
      w={"100%"}
      maxW={"16rem"}
      borderColor={"gray.200"}
      borderRadius={".5rem"}
      borderWidth={"1px"}
      padding={"1rem"}
      alignItems={"flex-start"}
      _hover={{
        bg: colorMode.colorMode === "dark" ? "gray.700" : "gray.200",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
      }}
      onClick={() => {
        router.push(`/folders/${id}`);
      }}
    >
      <Center borderRadius={"0.5rem"} padding={"0.5rem"} bgColor={"white"}>
        {getIconForSubject({ defaultColor: purpleHexCode, title })}
      </Center>
      <Text variant={"title"}>{title}</Text>
      {chatCount ? (
        <Text variant={"detail"}>
          {chatCount} chat{chatCount === 1 ? "" : "s"}
        </Text>
      ) : (
        <Text variant={"detail"}>No chats</Text>
      )}
    </VStack>
  );
};

export default FolderCard;
