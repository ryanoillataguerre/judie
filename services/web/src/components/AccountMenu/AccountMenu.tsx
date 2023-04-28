import useAuth from "@judie/hooks/useAuth";
import styles from "./AccountMenu.module.scss";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";

const getUserInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) {
    return "JD";
  }
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};

const AccountMenu = () => {
  const auth = useAuth();

  return (
    <Popover trigger="hover" placement={"bottom-end"}>
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
