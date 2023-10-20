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
      organizationId,
    };
  }
  if (schoolId) {
    return {
      organizationId: schoolData?.organizationId,
      schoolId,
    };
  }
  if (roomId) {
    return {
      organizationId: roomData?.organizationId,
      schoolId: roomData?.schoolId,
      roomId,
    };
  }
  return {
    organizationId,
    schoolId,
    roomId,
  };
};

export default useAdminActiveEntities;
