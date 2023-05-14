import useAuth from "@judie/hooks/useAuth";
import styles from "./AccountMenu.module.scss";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import Paywall from "../Paywall/Paywall";
import { useState } from "react";
import { SubscriptionStatus } from "@judie/data/types/api";
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";

const getUserInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) {
    return "JD";
  }
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};

const AccountMenu = ({
  setIsPaywallOpen,
}: {
  setIsPaywallOpen: (isOpen: boolean) => void;
}) => {
  const auth = useAuth();

  const { toggleColorMode, colorMode } = useColorMode();
  console.log(colorMode);
  return (
    <Popover trigger="hover" placement={"bottom-end"} size={"sm"}>
      <PopoverTrigger>
        <div className={styles.accountMenuContainer}>
          <p className={styles.lettersContainer}>
            {getUserInitials(
              auth?.userData?.firstName,
              auth?.userData?.lastName
            )}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          {auth?.userData?.subscription?.status ===
          SubscriptionStatus.ACTIVE ? null : (
            <div
              className={[styles.popoverContent].join(" ")}
              onClick={() => {
                setIsPaywallOpen(true);
              }}
            >
              Upgrade ⭐
            </div>
          )}
          <div className={[styles.popoverContent, styles.row].join(" ")}>
            <BsFillSunFill
              size={16}
              fill={colorMode === "light" ? "black" : "#d3d3d3"}
            />
            <Switch
              size={"md"}
              onChange={toggleColorMode}
              isChecked={colorMode === "dark"}
            />
            <BsMoonStarsFill
              size={16}
              fill={colorMode === "dark" ? "yellow" : "#d3d3d3"}
            />
          </div>
          <div
            className={[styles.popoverContent, styles.red].join(" ")}
            onClick={auth.logout}
          >
            Log Out
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AccountMenu;
