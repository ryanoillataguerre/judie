import { useState } from "react";
import styles from "./Sidebar.module.scss";
import { TbMessages } from "react-icons/tb";
import { MdOutlineAssignment } from "react-icons/md";
import { Tooltip } from "@chakra-ui/react";

const sidebarIcons = [
  {
    icon: <TbMessages size={20} color={"#FFFFFF"} />,
    label: "Chat",
    enabled: true,
    tooltipText: "Chat",
  },
  {
    icon: <MdOutlineAssignment size={20} color={"#d3d3d3"} />,
    label: "Quiz",
    enabled: false,
    tooltipText: "Quizzes are coming soon!",
  },
];

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState<string>(sidebarIcons[0].label);

  return (
    <div className={styles.sidebarContainer}>
      {sidebarIcons.map((icon, index) => {
        return (
          <Tooltip label={icon.tooltipText} placement="right" key={icon.label}>
            <div
              className={[
                styles.baseIcon,
                activeIcon === icon.label
                  ? styles.activeIcon
                  : styles.iconContainer,
              ].join(" ")}
              onClick={() => (icon.enabled ? setActiveIcon(icon.label) : null)}
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
