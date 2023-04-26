import { useState } from "react";
import styles from "./Sidebar.module.scss";
import { TbMessages } from "react-icons/tb";
import { MdOutlineAssignment } from "react-icons/md";
import { BsClockHistory, BsPlusSquareDotted } from "react-icons/bs";
import { Tooltip } from "@chakra-ui/react";
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
  const sidebarIcons = [
    {
      icon: <BsPlusSquareDotted size={20} color={"#FFFFFF"} />,
      label: "New Chat",
      enabled: true,
      tooltipText: "New Chat",
      onClick: () => {
        router.push("/chat?newChat=true");
      },
    },
    {
      icon: <BsClockHistory size={20} color={"#FFFFFF"} />,
      label: "Chats",
      enabled: true,
      tooltipText: "Chats",
      onClick: () => {
        router.push("/chats");
      },
    },
    {
      icon: <MdOutlineAssignment size={20} color={"#d3d3d3"} />,
      label: "Quiz",
      enabled: false,
      tooltipText: "Quizzes are coming soon!",
    },
  ];
  const activeIconIndex = getActiveIconIndex(router.pathname);
  const [activeIcon, setActiveIcon] = useState<number>(activeIconIndex);

  return (
    <div className={styles.sidebarContainer}>
      {sidebarIcons.map((icon, index) => {
        return (
          <Tooltip label={icon.tooltipText} placement="right" key={icon.label}>
            <div
              className={[
                styles.baseIcon,
                activeIcon === index ? styles.activeIcon : styles.iconContainer,
              ].join(" ")}
              onClick={() => {
                if (icon.onClick && icon.enabled) {
                  icon.onClick();
                }
                setActiveIcon(index);
              }}
            >
              {icon.icon}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default Sidebar;
