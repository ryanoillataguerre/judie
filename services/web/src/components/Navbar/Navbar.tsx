import { useState } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  // Mobile hamburger
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {/* Logo */}
        <img src={"/logo.svg"} alt={"Judie Logo"} className={styles.logo} />
        {/* Title */}
        <h1 className={styles.title}>Judie</h1>
      </div>
      <div className={styles.rightContainer}>
        {/* About */}
        {/* Sign Up */}
      </div>
    </div>
  );
};

export default Navbar;
