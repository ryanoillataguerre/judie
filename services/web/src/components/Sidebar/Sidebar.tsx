import {
  useMemo,
  useState,
  CSSProperties,
  useContext,
  useCallback,
} from "react";
import { PermissionType, SubscriptionStatus } from "@judie/data/types/api";
import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  useBreakpointValue,
  Center,
  useColorMode,
  useToken,
  VStack,
  chakra,
  shouldForwardProp,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdAdminPanelSettings, MdFeedback } from "react-icons/md";
import useAuth, { isPermissionTypeAdmin } from "@judie/hooks/useAuth";
import { useQuery } from "react-query";
import {
  deleteChatMutation,
  clearConversationsMutation,
  createChatMutation,
} from "@judie/data/mutations";
import { GET_USER_FOLDERS, getUserFoldersQuery } from "@judie/data/queries";
import ColorModeSwitcher from "../ColorModeSwitcher/ColorModeSwitcher";
import UpgradeButton from "../UpgradeButton/UpgradeButton";
import {
  BiChevronsLeft,
  BiChevronsRight,
  BiHelpCircle,
  BiHomeAlt,
} from "react-icons/bi";
import { HiMiniFolderOpen } from "react-icons/hi2";
import { isValidMotionProp, motion } from "framer-motion";
import { useSidebarOpenClose } from "@judie/context/sidebarOpenCloseProvider";

interface SidebarButtonProps {
  icon?: JSX.Element | undefined;
  label?: string | JSX.Element | undefined;
  key?: string | undefined;
  onClick?: () => void | undefined;
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

const ChakraMotionBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const FolderButton = ({
  id,
  title,
  numChats,
}: {
  id: string;
  title?: string | null;
  numChats?: number;
}) => {
  const router = useRouter();
  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);
  const buttonBgColor = useColorModeValue("#F6F6F6", "gray.800");
  return (
    <Button
      variant={"solid"}
      width={"16rem"}
      borderRadius={"0.5rem"}
      height={"100%"}
      bgColor={buttonBgColor}
      alignItems={"center"}
      justifyContent={"flex-start"}
      onClick={() => {
        router.push(`/folders/${id}`);
      }}
      marginY={"0.25rem"}
      h={"4rem"}
      p={"0.5rem"}
    >
      <Center
        borderRadius={"0.5rem"}
        padding={"0.5rem"}
        marginRight={"0.5rem"}
        bgColor={"white"}
      >
        <HiMiniFolderOpen size={24} color={purpleHexCode} />
      </Center>
      <VStack alignItems={"flex-start"}>
        <Text variant={"title"}>{title}</Text>
        <Text variant={"detail"}>{numChats} chats</Text>
      </VStack>
    </Button>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();
  const logoPath = useColorModeValue("/logo.svg", "/logo_dark.svg");

  const { toggleSidebar, isSidebarOpen } = useSidebarOpenClose();

  const colorMode = useColorMode();
  const colorKey = colorMode.colorMode === "dark" ? "purple.300" : "purple.500";
  const purpleHexCode = useToken("colors", colorKey);
  // Existing user chats
  const { data, isLoading: isGetChatsLoading } = useQuery(
    [GET_USER_FOLDERS, auth?.userData?.id],
    {
      queryFn: getUserFoldersQuery,
      staleTime: 60000,
      enabled: !!auth?.userData?.id,
    }
  );

  const onAdminClick = useCallback(() => {
    const filteredAdminPermissions = auth.userData?.permissions?.filter(
      (permission) => isPermissionTypeAdmin(permission.type)
    );
    if (filteredAdminPermissions?.length === 1) {
      const permission = filteredAdminPermissions[0];
      switch (permission.type) {
        case PermissionType.ORG_ADMIN:
          router.push(`/admin/organizations/${permission.organizationId}`);
          break;
        case PermissionType.SCHOOL_ADMIN:
          router.push(`/admin/schools/${permission.schoolId}`);
          break;
        case PermissionType.ROOM_ADMIN:
          router.push(`/admin/rooms/${permission.roomId}`);
          break;
        default:
          router.push("/admin");
          break;
      }
      return;
    } else if ((filteredAdminPermissions?.length || 0) > 1 || auth.isAdmin) {
      router.push("/admin");
      return;
    } else {
      toast({
        status: "warning",
        title: "No admin orgs",
      });
    }
  }, [auth.userData?.permissions, auth.isAdmin, router, toast]);

  const footerIcons: SidebarButtonProps[] = useMemo(() => {
    const options = [
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
        icon: <MdFeedback />,
        key: "feedback",
        label: "Feedback",
        onClick: () => {
          router.push("/feedback");
        },
      },
      ...(auth.isAdmin
        ? [
            {
              icon: <MdAdminPanelSettings />,
              key: "admin",
              label: "Admin",
              onClick: onAdminClick,
            },
          ]
        : []),
      ...(!(
        auth?.userData?.subscription?.status === SubscriptionStatus.ACTIVE
      ) &&
      !auth.isLoading &&
      router.isReady &&
      auth.userData &&
      !auth.isAdmin
        ? [
            {
              key: "upgrade",
              icon: (
                <Box
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    padding: "1rem 0",
                  }}
                >
                  <UpgradeButton />
                </Box>
              ),
            },
          ]
        : []),
      {
        icon: <ColorModeSwitcher />,
        key: "color-mode-switcher",
      },
    ];
    return options;
  }, [auth, router, onAdminClick]);

  const bgColor = useColorModeValue("#FFFFFF", "gray.900");
  const sidebarRelativeOrAbsoluteProps = useBreakpointValue({
    base: {
      position: "absolute",
      left: 0,
      zIndex: 100,
    },
    md: {},
  });
  const mobileVsDesktopClosedMenuHeight = useBreakpointValue({
    base: {
      height: "4.5",
    },
    md: { height: "calc(100vh - 2rem)" },
  });
  return (
    <ChakraMotionBox
      initial={false}
      animate={{
        width: isSidebarOpen ? "18rem" : "2rem",
        height: isSidebarOpen ? "calc(100vh - 2rem)" : "4.5rem",
        opacity: isSidebarOpen ? 1 : 0.5,
      }}
      bgColor={bgColor}
      height={
        isSidebarOpen
          ? { base: "calc(100vh - 2rem)", md: "calc(100vh - 2rem)" }
          : { base: "5rem", md: "calc(100vh - 2rem)" }
      }
      marginLeft={{ base: 1, md: "1rem" }}
      style={{
        display: "flex",
        borderRadius: "1.375rem",
        marginTop: "1rem",
        marginBottom: "1rem",
        ...(isSidebarOpen
          ? {
              padding: "1rem",
            }
          : {
              paddingTop: "1.5rem",
              paddingRight: "0.25rem",
              paddingLeft: "0.25rem",
              justifyContent: "flex-start",
            }),
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",

        ...(sidebarRelativeOrAbsoluteProps as CSSProperties),
      }}
    >
      {isSidebarOpen ? (
        <>
          <Flex
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            cursor={"pointer"}
            justifyContent={"space-between"}
          >
            <Flex
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onClick={() => {
                if (router.pathname.includes("/admin")) {
                  router.push("/admin");
                } else {
                  router.push("/dashboard");
                }
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
                  display: isSidebarOpen ? "block" : "none",
                }}
              >
                Judie AI
              </Text>
            </Flex>
            <BiChevronsLeft
              size={24}
              color={purpleHexCode}
              onClick={() => {
                toggleSidebar();
              }}
            />
          </Flex>

          <Button
            variant={"ghost"}
            size={"squareSm"}
            width={"100%"}
            marginTop={"2rem"}
            marginBottom={"0.3rem"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <BiHomeAlt size={18} style={{ marginRight: "0.6rem" }} />
            Dashboard
          </Button>
          <Button
            variant={"ghost"}
            size={"squareSm"}
            width={"100%"}
            marginTop={"0.3rem"}
            marginBottom={"1rem"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            onClick={() => {
              router.push("/settings");
            }}
          >
            <FiSettings size={18} style={{ marginRight: "0.6rem" }} />
            Settings
          </Button>
          <Divider backgroundColor="#565555" />
          {/* Chats container - scrollable */}
          <Text marginTop={"1rem"} variant={"detail"}>
            Folders
          </Text>
          {isGetChatsLoading || !auth?.userData?.id ? (
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
            >
              {data?.map((folder) => (
                <FolderButton
                  key={folder.id}
                  id={folder.id}
                  title={folder.userTitle}
                  numChats={folder?._count?.chats || 0}
                />
              ))}
            </Flex>
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
        </>
      ) : (
        <BiChevronsRight
          size={24}
          color={purpleHexCode}
          cursor={"pointer"}
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}
    </ChakraMotionBox>
  );
};

export default Sidebar;
