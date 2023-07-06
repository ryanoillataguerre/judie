import {
  useMemo,
  CSSProperties,
  useContext,
  useCallback,
  useState,
} from "react";
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
  Collapse,
  SlideFade,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import useAuth from "@judie/hooks/useAuth";
import { ChatContext } from "@judie/hooks/useChat";
import ColorModeSwitcher from "../../ColorModeSwitcher/ColorModeSwitcher";
import { useQuery } from "react-query";
import { GET_USER_ENTITIES, getUserEntitiesQuery } from "@judie/data/queries";
import { Organization, Room, School } from "@judie/data/types/api";
import useStorageState from "@judie/hooks/useStorageState";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { PlusSquareIcon } from "@chakra-ui/icons";
import InviteModal from "../InviteModal";

const NestedButton = ({
  title,
  expanded,
  onClickIcon,
  onClickButton,
  hasChildren,
  active,
}: {
  title: string;
  expanded: boolean;
  onClickIcon: () => void;
  onClickButton: () => void;
  hasChildren?: boolean;
  active?: boolean;
}) => {
  return (
    <Button
      size="sm"
      variant={"outline"}
      colorScheme={active ? "blue" : "gray"}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        padding: "1rem",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Icon */}
      {expanded ? (
        <MdKeyboardArrowDown
          onClick={onClickIcon}
          size={20}
          style={{
            marginRight: "0.8rem",
          }}
        />
      ) : hasChildren ? (
        <MdKeyboardArrowRight
          onClick={onClickIcon}
          size={20}
          style={{
            marginRight: "0.8rem",
          }}
        />
      ) : null}
      <Text
        onClick={onClickButton}
        overflowX={"scroll"}
        style={{
          width: "100%",
          textAlign: "start",
        }}
      >
        {title}
      </Text>
    </Button>
  );
};

const SidebarRoom = ({ room }: { room: Room }) => {
  const router = useRouter();
  const isActive = useMemo(() => {
    if (router.asPath.includes(`/rooms/${room.id}`)) {
      return true;
    }
    return false;
  }, [router]);
  return (
    <Flex
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <NestedButton
        title={room.name}
        expanded={false}
        onClickIcon={() => {}}
        onClickButton={() => {
          router.push(`/admin/rooms/${room.id}`);
        }}
        hasChildren={false}
        active={isActive}
      />
    </Flex>
  );
};

const SidebarSchool = ({ school }: { school: School }) => {
  const [expanded, setExpanded] = useStorageState(
    false,
    `sidebar-expanded-org-${school.id}`
  );
  const router = useRouter();
  const isActive = useMemo(() => {
    if (router.asPath.includes(`/schools/${school.id}`)) {
      return true;
    }
    return false;
  }, [router]);
  return (
    <Flex
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <NestedButton
        title={school.name}
        expanded={expanded}
        onClickIcon={() => setExpanded((expanded) => !expanded)}
        onClickButton={() => {
          router.push(`/admin/schools/${school.id}`);
        }}
        hasChildren={!!school.rooms?.length}
        active={isActive}
      />
      <Collapse
        in={expanded}
        style={{
          width: "100%",
        }}
      >
        <VStack
          style={{
            padding: "1rem 0 1rem 1rem",
            width: "100%",
          }}
        >
          {school.rooms?.map((room) => (
            <SidebarRoom room={room} />
          ))}
        </VStack>
      </Collapse>
    </Flex>
  );
};

const SidebarOrganization = ({ org }: { org: Organization }) => {
  const [expanded, setExpanded] = useStorageState(
    false,
    `sidebar-expanded-org-${org.id}`
  );
  const router = useRouter();
  const isActive = useMemo(() => {
    if (router.asPath.includes(`/organizations/${org.id}`)) {
      return true;
    }
    return false;
  }, [router]);
  return (
    <Flex
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
      marginY={"0.5rem"}
    >
      <NestedButton
        title={org.name}
        expanded={expanded}
        onClickIcon={() => setExpanded((expanded) => !expanded)}
        onClickButton={() => {
          router.push(`/admin/organizations/${org.id}`);
        }}
        hasChildren={!!org.schools?.length}
        active={isActive}
      />
      <Collapse
        in={expanded}
        style={{
          width: "100%",
        }}
      >
        <VStack
          style={{
            padding: "1rem 0 1rem 1rem",
            width: "100%",
          }}
        >
          {org.schools?.map((school) => (
            <SidebarSchool school={school} />
          ))}
        </VStack>
      </Collapse>
    </Flex>
  );
};

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

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const entities = auth.entities;

  const hasEntities =
    entities?.organizations?.length ||
    entities?.schools?.length ||
    entities?.rooms?.length;

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
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
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
            <Badge
              colorScheme="purple"
              style={{
                marginLeft: "1rem",
              }}
            >
              Admin
            </Badge>
          </Flex>
        </Flex>

        <Button
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "1rem",
          }}
          variant={"solid"}
          onClick={() => setInviteModalOpen(true)}
        >
          <PlusSquareIcon marginRight={"0.3rem"} /> Invite
        </Button>
        <Divider backgroundColor="#565555" />
        {/* Chats container - scrollable */}
        {auth.isLoading ? (
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
        ) : hasEntities ? (
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
            {entities?.organizations?.map((org) => (
              <SidebarOrganization org={org} />
            ))}
            {entities?.schools?.map((school) => (
              <SidebarSchool school={school} />
            ))}
            {/* {entities?.rooms?.map((room) => (
              <SidebarRoom room={room} />
            ))} */}
          </Flex>
        ) : (
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
            No admin privileges
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
