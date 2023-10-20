import { Button, Collapse, Flex, Text, VStack } from "@chakra-ui/react";
import { Organization, Room, School } from "@judie/data/types/api";
import useStorageState from "@judie/hooks/useStorageState";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

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
        overflowY={"hidden"}
        overflowX={"hidden"}
        _hover={{
          overflowX: "auto",
        }}
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

export const SidebarRoom = ({ room }: { room: Room }) => {
  const router = useRouter();
  const isActive = useMemo(() => {
    if (router.asPath.includes(`/rooms/${room.id}`)) {
      return true;
    }
    return false;
  }, [router, room?.id]);
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

export const SidebarSchool = ({ school }: { school: School }) => {
  const [expanded, setExpanded] = useStorageState(
    true,
    `sidebar-expanded-org-${school.id}`
  );
  const router = useRouter();
  const isActive = useMemo(() => {
    if (router.asPath.includes(`/schools/${school.id}`)) {
      return true;
    }
    return false;
  }, [router, school?.id]);
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
            <SidebarRoom room={room} key={room.id} />
          ))}
        </VStack>
      </Collapse>
    </Flex>
  );
};

export const SidebarOrganization = ({ org }: { org: Organization }) => {
  const [expanded, setExpanded] = useStorageState(
    true,
    `sidebar-expanded-org-${org.id}`
  );
  const router = useRouter();
  const isActive = useMemo(() => {
    if (router.asPath.includes(`/organizations/${org.id}`)) {
      return true;
    }
    return false;
  }, [router, org?.id]);
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
            <SidebarSchool school={school} key={school.id} />
          ))}
        </VStack>
      </Collapse>
    </Flex>
  );
};
