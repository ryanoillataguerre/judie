import { Room, School } from "@judie/data/types/api";
import useAuth from "./useAuth";

const useFlatAllEntities = () => {
  const { entities } = useAuth();
  const organizations = entities?.organizations;
  const orgSchools = entities?.organizations?.reduce((acc, org) => {
    if (org.schools?.length) {
      return [...acc, ...org.schools];
    }
    return acc;
  }, [] as School[]);
  const schools = [...(orgSchools || []), ...(entities?.schools || [])];
  const schoolRooms = entities?.schools?.reduce((acc, school) => {
    if (school.rooms?.length) {
      return [...acc, ...school.rooms];
    }
    return acc;
  }, [] as Room[]);
  const rooms = [...(schoolRooms || []), ...(entities?.rooms || [])];
  return {
    organizations,
    schools,
    rooms,
  };
};

export default useFlatAllEntities;
