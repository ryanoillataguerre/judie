import styles from "./Navbar.module.scss";
import Link from "next/link";
import Button, { ButtonVariant } from "../Button/Button";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { Badge } from "@chakra-ui/react";

const Navbar = () => {
  const auth = useAuth({ allowUnauth: true });
  const router = useRouter();
  const currentChatId = router?.query?.chatId;

  const [chatSubject, setChatSubject] = useState<string | undefined>();
  const {
    data: existingUserChat,
    isLoading: isExistingChatLoading,
    refetch: fetchExistingChat,
  } = useQuery({
    queryKey: [GET_CHAT_BY_ID, currentChatId],
    queryFn: () => getChatByIdQuery(currentChatId as string),
    onSuccess: (data) => {
      if (data?.subject) {
        setChatSubject(data.subject);
      }
    },
    enabled: !!currentChatId,
  });
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
        ) : router.asPath.includes("/chat/") ? (
          chatSubject ? (
            <Badge colorScheme="green" variant="subtle">
              Chat Subject: {chatSubject}
            </Badge>
          ) : (
            <Badge colorScheme="gray" variant="subtle">
              No Chat Subject
            </Badge>
          )
        ) : (
          <Link href={"/chat"}>
            <Button
              type="button"
              label="Chat"
              variant={ButtonVariant.Default}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
