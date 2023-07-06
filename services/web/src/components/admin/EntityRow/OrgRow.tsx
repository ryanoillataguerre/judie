import { Button, Text } from "@chakra-ui/react";
import { Organization } from "@judie/data/types/api";
import { useRouter } from "next/router";

const OrgRow = ({ org }: { org: Organization }) => {
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
      onClick={() => {
        router.push(`/admin/organizations/${org.id}`);
      }}
    >
      {org.name}
    </Button>
  );
};

export default OrgRow;
