import { useState } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import Button, { ButtonVariant } from "../Button/Button";
import { useRouter } from "next/router";
import useAuth from "@judie/hooks/useAuth";

const Navbar = () => {
  const auth = useAuth({ allowUnauth: true });
  console.log("auth", auth);
  // TODO: Mobile hamburger
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  return (
    <div className={styles.container}>
      <Link href={"/"}>
        <div className={styles.leftContainer}>
          {/* Logo */}
          <img src={"/logo.svg"} alt={"Judie Logo"} className={styles.logo} />
          {/* Title */}
          <h1 className={styles.title}>Judie</h1>
        </div>
      </Link>
      <div className={styles.rightContainer}>
        {/* TODO: About */}

        {!auth.userData && (
          <>
            <Link href={"/signin"}>
              <Button
                type="button"
                label="Sign In"
                variant={ButtonVariant.Default}
              />
            </Link>
            {/* Sign Up */}
            <Link href={"/signup"}>
              <Button
                type="button"
                label="Sign Up"
                variant={ButtonVariant.Blue}
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
