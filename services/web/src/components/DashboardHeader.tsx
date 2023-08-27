import {
  Box,
  Button,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

const DashboardHeader = () => {
  // TODO: New folder modal
  // TODO: Create new chat should take you to new chat page
  const buttonSize = useBreakpointValue({
    base: "sm",
    md: "md",
  });
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"space-between"}
      paddingY={"1rem"}
      width={"100%"}
    >
      <Box>{/* Search goes here */}</Box>
      <HStack>
        <Button size={buttonSize} variant={"secondary"}>
          <Text variant={"button"}>+ Create new chat</Text>
        </Button>
        <Button size={buttonSize} variant={"purp"}>
          <Text variant={"button"}>New Folder</Text>
        </Button>
      </HStack>
    </HStack>
  );
};

export default DashboardHeader;
