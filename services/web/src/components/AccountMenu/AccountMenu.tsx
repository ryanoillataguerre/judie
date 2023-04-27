import useAuth from "@judie/hooks/useAuth";
import styles from "./AccountMenu.module.scss";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";

const getUserInitials = (name?: string) => {
  if (!name) {
    return "JD";
  }
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }
  return `${nameParts[0].slice(0, 1)}${nameParts[1].slice(0, 1)}`.toUpperCase();
};

const AccountMenu = () => {
  const auth = useAuth();

  return (
    <Popover trigger="hover" placement={"bottom-end"}>
      <PopoverTrigger>
        <div className={styles.accountMenuContainer}>
          <p className={styles.lettersContainer}>
            {getUserInitials(auth?.userData?.name)}
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
