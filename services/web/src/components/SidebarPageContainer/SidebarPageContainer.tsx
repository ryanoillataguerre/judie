import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";

interface SidebarPageContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
}

// const OpenCloseButton = ({
//   isOpen,
//   setIsOpen,
// }: {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }) => {
//   return (
//     <Box
//       style={{
//         position: "fixed",
//         top: "0.4rem",
//         left: isOpen ? "18.5rem" : "1.5rem",
//         padding: "0.5rem",
//       }}
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       {isOpen ? (
//         <LuChevronLeftSquare
//           style={{
//             zIndex: 1000,
//           }}
//           cursor={"pointer"}
//           size={20}
//         />
//       ) : (
//         <LuChevronRightSquare
//           style={{
//             zIndex: 1000,
//           }}
//           cursor={"pointer"}
//           size={20}
//         />
//       )}
//     </Box>
//   );
// };

const SidebarPageContainer = ({
  children,
  scroll = true,
}: SidebarPageContainerProps) => {
  const containerPaddingLeft = useBreakpointValue({
    base: "0rem",
    md: "0",
  });
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
        overflow={scroll ? "auto" : "hidden"}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          paddingLeft: containerPaddingLeft,
        }}
      >
        {/* <OpenCloseButton isOpen={isOpen} setIsOpen={setIsOpen} /> */}
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarPageContainer;
