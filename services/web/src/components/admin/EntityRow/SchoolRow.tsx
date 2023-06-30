import { Button, Text } from "@chakra-ui/react";
import { Organization, School } from "@judie/data/types/api";
import { useRouter } from "next/router";

const SchoolRow = ({ school }: { school: School }) => {
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
        router.push(`/admin/schools/${school.id}`);
      }}
    >
      {school.name}
    </Button>
  );
};

export default SchoolRow;
