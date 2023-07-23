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

const useAdminActiveOrganization = () => {
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

  if (organizationId) {
    return organizationId as string;
  }
  switch (router.asPath) {
    case "/admin":
      return null;
    case "/admin/organizations":
      return organizationData?.id;
    case "/admin/schools":
      return schoolData?.organizationId;
    case "/admin/rooms":
      return roomData?.organizationId;
    default:
      return null;
  }
};

export default useAdminActiveOrganization;
