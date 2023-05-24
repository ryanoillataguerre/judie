import { useState } from "react";
import { Box, Flex, Collapse } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
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
        top: "2rem",
        left: isOpen ? "20rem" : "2rem",
      }}
    >
      {isOpen ? (
        <BsChevronBarLeft
          cursor={"pointer"}
          onClick={() => setIsOpen(false)}
          size={16}
        />
      ) : (
        <BsChevronBarRight
          cursor={"pointer"}
          onClick={() => setIsOpen(true)}
          size={16}
        />
      )}
    </Box>
  );
};

const SidebarPageContainer = ({ children }: SidebarPageContainerProps) => {
  const [isOpen, setIsOpen] = useStorageState<boolean>(false, "sidebarOpen");
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
        }}
      >
        <OpenCloseButton isOpen={isOpen} setIsOpen={setIsOpen} />
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarPageContainer;
