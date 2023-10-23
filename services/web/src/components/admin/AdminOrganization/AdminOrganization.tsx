import {
  Box,
  Button,
  HStack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  GET_INVITES_FOR_ORG,
  GET_ORG_BY_ID,
  GET_USERS_FOR_ORG,
  getInvitesForOrgQuery,
  getOrgByIdQuery,
  getUsersForOrgQuery,
} from "@judie/data/queries";
import { useMutation, useQuery } from "react-query";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useState } from "react";
import CreateSchoolModal from "../CreateSchoolModal";
import SchoolsTable from "../tables/SchoolsTable";
import RoomsTable from "../tables/RoomsTable";
import UsersTable from "../tables/UsersTable";
import InvitesTable from "../tables/InvitesTable";
import EditableTitle from "../EditableTitle";
import { putOrgMutation } from "@judie/data/mutations";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";
import InviteModal, { InviteModalType } from "../InviteModal";
import BulkInviteModal from "../BulkInviteModal";
import useAuth from "@judie/hooks/useAuth";

const AdminOrganization = ({ id }: { id: string }) => {
  const { refreshEntities } = useAuth();
  const { data: organizationData, refetch: refetchOrg } = useQuery({
    queryKey: [GET_ORG_BY_ID, id],
    queryFn: () => getOrgByIdQuery(id),
    enabled: !!id,
  });

  const { data: organizationUserData } = useQuery({
    queryKey: [GET_USERS_FOR_ORG, id],
    queryFn: () => getUsersForOrgQuery(id),
    enabled: !!id,
  });

  const { data: organizationInvitesData } = useQuery({
    queryKey: [GET_INVITES_FOR_ORG, id],
    queryFn: () => getInvitesForOrgQuery(id),
    enabled: !!id,
  });

  const editOrgMutation = useMutation({
    mutationFn: putOrgMutation,
    onSuccess: () => {
      refetchOrg();
      refreshEntities();
    },
  });

  const [createSchoolOpen, setCreateSchoolOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [bulkInviteOpen, setBulkInviteOpen] = useState(false);
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const router = useRouter();

  return (
    <VStack
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "100%",
      }}
    >
      <CreateSchoolModal
        isOpen={createSchoolOpen}
        onClose={() => setCreateSchoolOpen(false)}
        organizationId={organizationData?.id as string}
      />
      <InviteModal
        type={InviteModalType.ORGANIZATION}
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
      <BulkInviteModal
        isOpen={bulkInviteOpen}
        onClose={() => setBulkInviteOpen(false)}
      />
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
        paddingTop={"2rem"}
      >
        <HStack paddingRight={"1rem"}>
          <Box minW={"20px"}>
            <BsArrowLeft
              size={20}
              style={{
                margin: "0 1rem",
              }}
              onClick={() => router.back()}
              cursor={"pointer"}
            />
          </Box>

          <EditableTitle
            title={organizationData?.name}
            onChange={(value) => {
              value = value.trim();
              if (!value || value.length < 1) return;
              if (value === organizationData?.name) return;
              editOrgMutation.mutate({
                organizationId: organizationData?.id as string,
                name: value,
              });
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <Button
            variant={"purp"}
            size={buttonSize}
            onClick={() => setInviteModalOpen(true)}
          >
            + Invite
          </Button>
          <Button
            variant={"purp"}
            size={buttonSize}
            onClick={() => setBulkInviteOpen(true)}
          >
            + Bulk Invite
          </Button>
          <Button
            colorScheme="green"
            size={buttonSize}
            onClick={() => setCreateSchoolOpen(true)}
          >
            <PlusSquareIcon marginRight={"0.3rem"} /> Create School
          </Button>
        </HStack>
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {organizationData?.schools?.length ? <Tab>Schools</Tab> : null}
          {organizationData?.rooms?.length ? <Tab>Classes</Tab> : null}
          {organizationUserData?.length ? <Tab>Users</Tab> : null}
          {organizationInvitesData?.length ? <Tab>Invites</Tab> : null}
        </TabList>
        <TabPanels>
          {organizationData?.schools?.length ? (
            <TabPanel>
              <SchoolsTable schools={organizationData?.schools} />
            </TabPanel>
          ) : null}
          {organizationData?.rooms?.length ? (
            <TabPanel>
              <RoomsTable rooms={organizationData?.rooms} />
            </TabPanel>
          ) : null}
          {organizationUserData?.length ? (
            <TabPanel>
              <UsersTable users={organizationUserData} organizationId={id} />
            </TabPanel>
          ) : null}
          {organizationInvitesData?.length ? (
            <TabPanel>
              <InvitesTable invites={organizationInvitesData} />
            </TabPanel>
          ) : null}
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminOrganization;
