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
