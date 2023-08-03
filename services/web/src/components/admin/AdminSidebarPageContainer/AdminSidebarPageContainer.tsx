import { Box, Flex } from "@chakra-ui/react";
import { LuChevronLeftSquare, LuChevronRightSquare } from "react-icons/lu";
import useStorageState from "@judie/hooks/useStorageState";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

interface AdminSidebarPageContainerProps {
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
        top: "0.4rem",
        left: isOpen ? "18.5rem" : "1.5rem",
        padding: "0.5rem",
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

const AdminSidebarPageContainer = ({
  children,
}: AdminSidebarPageContainerProps) => {
  const [isOpen, setIsOpen] = useStorageState<boolean>(
    true,
    "adminSidebarOpen"
  );
  return (
    <Flex
      style={{
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
      }}
    >
      <AdminSidebar isOpen={isOpen} />
      <Box
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          maxWidth: "100%",
          padding: "2rem 2rem",
        }}
      >
        <OpenCloseButton isOpen={isOpen} setIsOpen={setIsOpen} />
        {children}
      </Box>
    </Flex>
  );
};

export default AdminSidebarPageContainer;
