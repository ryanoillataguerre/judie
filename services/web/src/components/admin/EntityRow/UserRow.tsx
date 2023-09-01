import { Button, Td, Text, Tr } from "@chakra-ui/react";
import { Organization, School, User } from "@judie/data/types/api";
import { useRouter } from "next/router";

const UserRow = ({ user }: { user: User }) => {
  const router = useRouter();
  return (
    <></>
    // <Tr
    //   onClick={() => {
    //     router.push(`/admin/users/${user.id}`);
    //   }}
    // >
    //   <Td>{user.email}</Td>
    //   <Td>{user.firstName || ""}</Td>
    //   <Td>{user.lastName || ""}</Td>
    //   <Td>{user.lastMessageAt?.toLocaleDateString() || ""}</Td>
    //   <Td isNumeric>25.4</Td>
    // </Tr>
  );
};

export default UserRow;
