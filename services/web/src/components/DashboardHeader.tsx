import {
  Box,
  Button,
  HStack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import CreateFolderModal from "./CreateFolderModal";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { createChatMutation } from "@judie/data/mutations";
import {
  GET_USER_CHATS,
  GET_USER_FOLDERS,
  getUserChatsQuery,
  getUserFoldersQuery,
} from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";

const DashboardHeader = ({
  onCreateChat,
  isLoading,
}: {
  onCreateChat?: () => void;
  isLoading?: boolean;
}) => {
  const auth = useAuth();
  const router = useRouter();
  const toast = useToast();
  // TODO: Create new chat should take you to new chat page
  const buttonSize = useBreakpointValue({
    base: "sm",
    md: "md",
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { refetch } = useQuery([GET_USER_CHATS, auth?.userData?.id], {
    queryFn: getUserChatsQuery,
    staleTime: 60000,
    enabled: false,
  });

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
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
        <Button
          size={buttonSize}
          variant={"purp"}
          type={"button"}
          isLoading={isLoading}
          onClick={onCreateChat}
        >
          <Text variant={"button"}>+ Learn something new</Text>
        </Button>

        {!isMobile && (
          <Button
            size={buttonSize}
            variant={"secondary"}
            type={"button"}
            onClick={() => {
              setIsCreateOpen(true);
            }}
          >
            <Text variant={"button"}>New Folder</Text>
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default DashboardHeader;
