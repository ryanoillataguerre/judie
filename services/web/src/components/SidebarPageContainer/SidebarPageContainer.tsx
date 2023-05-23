import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";

interface SidebarPageContainerProps {
  children: React.ReactNode;
}

const SidebarPageContainer = ({ children }: SidebarPageContainerProps) => {
  return (
    <Flex
      style={{
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Sidebar />
      <Box
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarPageContainer;
