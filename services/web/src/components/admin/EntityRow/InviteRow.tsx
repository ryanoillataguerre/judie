import { Button } from "@chakra-ui/react";
import { Invite } from "@judie/data/types/api";

// Columns:

// email
// permissions
// createdAt

const InviteRow = ({ invite }: { invite: Invite }) => {
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
