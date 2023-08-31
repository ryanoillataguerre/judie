import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";
import { LuChevronLeftSquare, LuChevronRightSquare } from "react-icons/lu";
import useStorageState from "@judie/hooks/useStorageState";
import SidebarChatNav from "../SidebarChatNav/SidebarChatNav";

interface SidebarPageContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
}

const OpenCloseButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Box
      style={{
        position: "fixed",
        top: "0.4rem",
        left: isOpen ? "18.5rem" : "1.5rem",
        padding: "0.5rem",
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? (
        <LuChevronLeftSquare
          style={{
            zIndex: 1000,
          }}
          cursor={"pointer"}
          size={20}
        />
      ) : (
        <LuChevronRightSquare
          style={{
            zIndex: 1000,
          }}
          cursor={"pointer"}
          size={20}
        />
      )}
    </Box>
  );
};

const SidebarPageContainer = ({
  children,
  scroll = true,
}: SidebarPageContainerProps) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const [isOpen, setIsOpen] = useStorageState<boolean>(
    isMobile ? false : true,
    "sidebarOpen"
  );
  return (
    <Flex
      style={{
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Sidebar isOpen={isOpen} />
      <SidebarChatNav />
      <Box
        overflow={scroll ? "scroll" : "hidden"}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          position: "relative",
        }}
        marginLeft={"0px"}
      >
        <OpenCloseButton isOpen={isOpen} setIsOpen={setIsOpen} />
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarPageContainer;
