import styles from "./Navbar.module.scss";
import Link from "next/link";
import Button, { ButtonVariant } from "../Button/Button";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";

const Navbar = () => {
  const auth = useAuth({ allowUnauth: true });
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
        {!auth.userData && !auth.isLoading ? (
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
        ) : router.asPath.includes("/chat/") ? null : (
          <Link href={"/chat"}>
            <Button type="button" label="Chat" variant={ButtonVariant.Blue} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
