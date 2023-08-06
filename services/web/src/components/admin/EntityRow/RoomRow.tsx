import { Button, Text } from "@chakra-ui/react";
import { Organization, Room } from "@judie/data/types/api";
import { useRouter } from "next/router";

// Columns:

// name
// numStudents
// numTeachers

const RoomRow = ({ room }: { room: Room }) => {
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
        router.push(`/admin/rooms/${room.id}`);
      }}
    >
      {room.name}
    </Button>
  );
};

export default RoomRow;
