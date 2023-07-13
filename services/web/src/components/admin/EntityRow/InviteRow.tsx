import { Button, Text } from "@chakra-ui/react";
import { Invite, Organization } from "@judie/data/types/api";
import { useRouter } from "next/router";

const InviteRow = ({ invite }: { invite: Invite }) => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      colorScheme={"white"}
      style={{
        width: "100%",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "0.9rem",
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {invite.email}
    </Button>
  );
};

export default InviteRow;
