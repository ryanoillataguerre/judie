import { useState } from "react";
import { BsClockHistory, BsPlusSquareDotted } from "react-icons/bs";
import {
  Button,
  Divider,
  Flex,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TfiTrash } from "react-icons/tfi";
import { FiServer, FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import useAuth from "@judie/hooks/useAuth";

const getActiveIconIndex = (path: string) => {
  switch (true) {
    case path.includes("/chat/"):
      return 0;
    case path.includes("/chats"):
      return 1;
    case path.includes("/quiz"):
      return 2;
    default:
      return 0;
  }
};
interface SidebarButtonProps {
  icon?: JSX.Element;
  label?: string | JSX.Element;
  onClick?: () => void;
}
const SidebarButton = ({ icon, label, onClick }: SidebarButtonProps) => {
  return (
    <Button colorScheme="white" variant={"ghost"}>
      {icon}
      <Text
        style={{
          marginLeft: "0.5rem",
          fontWeight: 500,
        }}
      >
        {label}
      </Text>
    </Button>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const auth = useAuth();
  const activeIconIndex = getActiveIconIndex(router.pathname);
  const [activeIcon, setActiveIcon] = useState<number>(activeIconIndex);
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");
  // TODO: Clear conversations mutation

  const footerIcons: SidebarButtonProps[] = [
    {
      icon: <TfiTrash />,
      label: "Clear Conversations",
      onClick: () => {
        // TODO: Pop up modal to confirm
      },
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      onClick: () => {
        router.push("/settings");
      },
    },
    {
      icon: <RiLogoutBoxLine />,
      label: "Logout",
      onClick: () => {
        auth.logout();
      },
    },
  ];
  return (
    <Flex
      style={{
        width: "20vw",
        height: "100vh",
        backgroundColor: "transparent",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "1rem",
      }}
      boxShadow={"lg"}
    >
      <Flex
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Flex
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Image
            src={logoPath}
            alt="logo"
            style={{
              height: "3rem",
              width: "3rem",
            }}
          />
          <Text
            style={{
              fontSize: "1.3rem",
              fontWeight: "semibold",
              marginLeft: "0.5rem",
            }}
          >
            Judie AI
          </Text>
        </Flex>
        <Button
          variant={"outline"}
          colorScheme="white"
          style={{
            width: "100%",
            marginTop: "1rem",
            marginBottom: "1rem",
            borderColor: "#565555",
            padding: "1.5rem",
          }}
          onClick={() => {
            // TODO: Create a new chat mutation
            // TODO: Navigate to same url but with query for ID
          }}
        >
          + New Chat
        </Button>
        <Divider backgroundColor="#565555" />
      </Flex>
      {/* Chats container - scrollable */}
      <Flex
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "scroll",
        }}
      ></Flex>
      {/* Bottom container - fixed to bottom */}
      <Flex
        style={{
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingBottom: "2rem",
        }}
      >
        <Divider
          backgroundColor={"#565555"}
          style={{
            marginBottom: "1rem",
          }}
        />
        {footerIcons.map((iconData) => {
          return <SidebarButton key={iconData.label as string} {...iconData} />;
        })}
      </Flex>
    </Flex>
  );
};

export default Sidebar;
