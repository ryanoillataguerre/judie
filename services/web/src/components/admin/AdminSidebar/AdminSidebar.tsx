import { useMemo, CSSProperties, useContext, useCallback } from "react";
import { BsFillChatTextFill } from "react-icons/bs";
import { BiHelpCircle } from "react-icons/bi";
import {
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import useAuth from "@judie/hooks/useAuth";
import { ChatContext } from "@judie/hooks/useChat";
import ColorModeSwitcher from "../../ColorModeSwitcher/ColorModeSwitcher";

interface SidebarButtonProps {
  icon?: JSX.Element;
  label?: string | JSX.Element;
  key?: string;
  onClick?: () => void;
}
const SidebarButton = ({ icon, label, onClick }: SidebarButtonProps) => {
  return (
    <Button variant={"ghost"} onClick={onClick}>
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

const AdminSidebar = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  const auth = useAuth();
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");

  const onChatClick = useCallback(() => {
    router.push("/chat");
  }, [router]);

  const footerIcons: SidebarButtonProps[] = useMemo(() => {
    const options = [
      {
        icon: <FiSettings />,
        key: "settings",
        label: "Settings",
        onClick: () => {
          router.push("/settings", undefined, { shallow: true });
        },
      },
      {
        icon: <BiHelpCircle />,
        key: "help",
        label: "Help",
        onClick: () => {
          window.open("https://help.judie.io", "_blank");
        },
      },
      {
        icon: <RiLogoutBoxLine />,
        key: "logout",
        label: "Logout",
        onClick: () => {
          auth.logout();
        },
      },
      {
        icon: <BsFillChatTextFill />,
        key: "chat",
        label: "Chat",
        onClick: onChatClick,
      },
      {
        icon: <ColorModeSwitcher />,
        key: "color-mode-switcher",
      },
    ];
    return options;
  }, [auth, router]);

  const bgColor = useColorModeValue("#FFFFFF", "#2a3448");
  const sidebarRelativeOrAbsoluteProps = useBreakpointValue({
    base: {
      position: "absolute",
      left: 0,
      zIndex: 100,
    },
    md: {},
  });
  return isOpen ? (
    <>
      {/* Sidebar content */}
      <Flex
        style={{
          width: "18rem",
          maxWidth: "18rem",
          minWidth: "18rem",
          height: "100vh",
          backgroundColor: bgColor,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "1rem",
          ...(sidebarRelativeOrAbsoluteProps as CSSProperties),
        }}
        boxShadow={"lg"}
      >
        <Flex
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Flex
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1rem",
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
        </Flex>

        <Divider backgroundColor="#565555" />
        {/* Chats container - scrollable */}
        {true ? (
          <Flex
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "column",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner />
          </Flex>
        ) : (
          <Flex
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "column",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "flex-start",
              overflowY: "scroll",
              marginTop: "1rem",
            }}
          ></Flex>
        )}
        {/* Bottom container - fixed to bottom */}
        <Flex
          style={{
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingBottom: "1rem",
          }}
        >
          <Divider
            backgroundColor={"#565555"}
            style={{
              marginBottom: "1rem",
            }}
          />
          {footerIcons.map((iconData) => {
            return iconData.label ? (
              <SidebarButton key={iconData.key} {...iconData} />
            ) : (
              iconData.icon
            );
          })}
        </Flex>
      </Flex>
    </>
  ) : (
    <Flex
      style={{
        width: "1rem",
        height: "100vh",
        backgroundColor: bgColor,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        ...(sidebarRelativeOrAbsoluteProps as CSSProperties),
      }}
      boxShadow={"lg"}
    ></Flex>
  );
};

export default AdminSidebar;
