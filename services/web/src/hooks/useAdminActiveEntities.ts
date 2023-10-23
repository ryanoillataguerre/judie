import {
  GET_ORG_BY_ID,
  GET_ROOM_BY_ID,
  GET_SCHOOL_BY_ID,
  getOrgByIdQuery,
  getRoomByIdQuery,
  getSchoolByIdQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQuery } from "react-query";

const useAdminActiveEntities = () => {
  const router = useRouter();
  const { organizationId, schoolId, roomId } = router.query;

  const { data: roomData } = useQuery({
    queryKey: [GET_ROOM_BY_ID, roomId],
    queryFn: () => getRoomByIdQuery(roomId as string),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 20,
  });
  const schId = useMemo(() => {
    if (schoolId) {
      return schoolId as string;
    }
    if (roomId) {
      return roomData?.schoolId;
    }
  }, [schoolId, roomId, roomData?.schoolId]);

  const { data: schoolData } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, schId],
    queryFn: () => getSchoolByIdQuery(schId as string),
    enabled: !!schId,
    staleTime: 1000 * 60 * 20,
  });
  const orgId = useMemo(() => {
    if (organizationId) {
      return organizationId as string;
    }
    if (schoolId) {
      return schoolData?.organizationId;
    }
    if (roomId) {
      return roomData?.organizationId;
    }
  }, [organizationId, schoolId, roomId, roomData?.organizationId]);

  const { data: organizationData } = useQuery({
    queryKey: [GET_ORG_BY_ID, orgId],
    queryFn: () => getOrgByIdQuery(orgId as string),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 20,
  });

  if (roomId) {
    return {
      organizationId: roomData?.organizationId,
      schoolId: roomData?.schoolId,
      roomId: roomId as string,
      organization: organizationData,
      school: schoolData,
      room: roomData,
    };
  }
  if (schId) {
    return {
      organizationId: schoolData?.organizationId,
      schoolId: schoolId as string,
      organization: organizationData,
      school: schoolData,
    };
  }
  if (orgId && !schId && !roomId) {
    return {
      organizationId: orgId as string,
      organization: organizationData,
    };
  }

  return {
    organizationId: orgId as string | undefined,
    schoolId: schoolId as string | undefined,
    roomId: roomId as string | undefined,
    organization: organizationData,
    school: schoolData,
    room: roomData,
  };
};

export default useAdminActiveEntities;
