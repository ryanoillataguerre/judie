import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";
import { LuChevronLeftSquare, LuChevronRightSquare } from "react-icons/lu";
import useStorageState from "@judie/hooks/useStorageState";

interface SidebarPageContainerProps {
  children: React.ReactNode;
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
        top: "3.5rem",
        left: isOpen ? "18.5rem" : "1.5rem",
      }}
    >
      {isOpen ? (
        <LuChevronLeftSquare
          style={{
            zIndex: 1000,
          }}
          cursor={"pointer"}
          onClick={() => setIsOpen(false)}
          size={20}
        />
      ) : (
        <LuChevronRightSquare
          style={{
            zIndex: 1000,
          }}
          cursor={"pointer"}
          onClick={() => setIsOpen(true)}
          size={20}
        />
      )}
    </Box>
  );
};

const SidebarPageContainer = ({ children }: SidebarPageContainerProps) => {
  const [isOpen, setIsOpen] = useStorageState<boolean>(true, "sidebarOpen");
  return (
    <Flex
      style={{
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Sidebar isOpen={isOpen} />
      <Box
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <OpenCloseButton isOpen={isOpen} setIsOpen={setIsOpen} />
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarPageContainer;
