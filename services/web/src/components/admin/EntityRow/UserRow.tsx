import { Button, Text } from "@chakra-ui/react";
import { Organization, School, User } from "@judie/data/types/api";
import { useRouter } from "next/router";

const UserRow = ({ user }: { user: User }) => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      colorScheme={"white"}
      style={{
        width: "100%",
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
      onClick={() => {
        router.push(`/admin/users/${user.id}`);
      }}
    >
      {user.firstName} {user.lastName}
    </Button>
  );
};

export default UserRow;
