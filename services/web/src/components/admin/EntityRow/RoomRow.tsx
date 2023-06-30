import { Button, Text } from "@chakra-ui/react";
import { Organization, Room } from "@judie/data/types/api";
import { useRouter } from "next/router";

const RoomRow = ({ room }: { room: Room }) => {
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
        router.push(`/admin/rooms/${room.id}`);
      }}
    >
      {room.name}
    </Button>
  );
};

export default RoomRow;
