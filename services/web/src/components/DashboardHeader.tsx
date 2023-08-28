import {
  Box,
  Button,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import CreateFolderModal from "./CreateFolderModal";
import { useState } from "react";

const DashboardHeader = () => {
  // TODO: Create new chat should take you to new chat page
  const buttonSize = useBreakpointValue({
    base: "sm",
    md: "md",
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"space-between"}
      paddingY={"1rem"}
      width={"100%"}
    >
      <CreateFolderModal isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      <Box>{/* Search goes here */}</Box>
      <HStack>
        <Button size={buttonSize} variant={"secondary"} type={"button"}>
          <Text variant={"button"}>+ Create new chat</Text>
        </Button>
        <Button
          size={buttonSize}
          variant={"purp"}
          type={"button"}
          onClick={() => {
            setIsCreateOpen(true);
          }}
        >
          <Text variant={"button"}>New Folder</Text>
        </Button>
      </HStack>
    </HStack>
  );
};

export default DashboardHeader;
