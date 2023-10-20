import {
  GET_ORG_BY_ID,
  GET_ROOM_BY_ID,
  GET_SCHOOL_BY_ID,
  getOrgByIdQuery,
  getRoomByIdQuery,
  getSchoolByIdQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const useAdminActiveEntities = () => {
  const router = useRouter();
  const { organizationId, schoolId, roomId } = router.query;

  const { data: organizationData } = useQuery({
    queryKey: [GET_ORG_BY_ID, organizationId],
    queryFn: () => getOrgByIdQuery(organizationId as string),
    enabled: !!organizationId,
  });
  const { data: schoolData } = useQuery({
    queryKey: [GET_SCHOOL_BY_ID, schoolId],
    queryFn: () => getSchoolByIdQuery(schoolId as string),
    enabled: !!schoolId,
  });
  const { data: roomData } = useQuery({
    queryKey: [GET_ROOM_BY_ID, roomId],
    queryFn: () => getRoomByIdQuery(roomId as string),
    enabled: !!roomId,
  });

  if (organizationId && !schoolId && !roomId) {
    return {
      organizationId: organizationId as string,
    };
  }
  if (schoolId) {
    return {
      organizationId: schoolData?.organizationId,
      schoolId: schoolId as string,
    };
  }
  if (roomId) {
    return {
      organizationId: roomData?.organizationId,
      schoolId: roomData?.schoolId,
      roomId: roomId as string,
    };
  }
  return {
    organizationId: organizationId as string | undefined,
    schoolId: schoolId as string | undefined,
    roomId: roomId as string | undefined,
  };
};

export default useAdminActiveEntities;
