import { useState } from "react";
import { BsClockHistory, BsPlusSquareDotted } from "react-icons/bs";
import { Flex, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";

const getActiveIconIndex = (path: string) => {
  switch (true) {
    case path.includes("/chat/"):
      return 0;
    case path.includes("/chats"):
      return 1;
    case path.includes("/quiz"):
      return 2;
    default:
      return 0;
  }
};

const Sidebar = () => {
  const router = useRouter();
  const activeIconIndex = getActiveIconIndex(router.pathname);
  const [activeIcon, setActiveIcon] = useState<number>(activeIconIndex);

  return (
    <Flex
      style={{
        width: "15vw",
        height: "100vh",
        backgroundColor: "transparent",
      }}
    ></Flex>
  );
};

export default Sidebar;
