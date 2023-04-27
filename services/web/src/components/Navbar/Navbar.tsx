import styles from "./Navbar.module.scss";
import Link from "next/link";
import Button, { ButtonVariant } from "../Button/Button";
import useAuth from "@judie/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { Badge, useToast } from "@chakra-ui/react";
import { SubscriptionStatus } from "@judie/data/types/api";
import AccountMenu from "../AccountMenu/AccountMenu";

const getColorSchemeFromQuestionsAsked = (questionsAsked?: number) => {
  if (!questionsAsked && questionsAsked !== 0) {
    return "gray";
  }
  if (questionsAsked < 4) {
    return "green";
  }
  if (questionsAsked < 8) {
    return "yellow";
  }
  return "red";
};

const Navbar = () => {
  const auth = useAuth({ allowUnauth: true });
  const router = useRouter();
  const toast = useToast();
  const currentChatId = router?.query?.chatId;
  useEffect(() => {
    // if (router.query.paid) {
    //   auth.refresh();
    // }
  }, [auth, router]);

  console.log(auth);

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

  useEffect(() => {
    if (router?.query?.paid) {
      toast({
        title: "Success!",
        description: "Welcome to unlimited access",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [router, toast]);

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
        ) : (
          <>
            {router.asPath.includes("/chat/") ? (
              <div className={styles.badgesContainer}>
                {auth?.isPaid ? (
                  <Badge colorScheme="green" variant="subtle">
                    Subscription: Active
                  </Badge>
                ) : (
                  <Badge
                    colorScheme={getColorSchemeFromQuestionsAsked(
                      auth?.userData?.questionsAsked
                    )}
                    variant="subtle"
                  >
                    Questions remaining:{" "}
                    {10 - (auth?.userData?.questionsAsked || 0)}
                  </Badge>
                )}
                {chatSubject ? (
                  <Badge colorScheme="green" variant="subtle">
                    Chat Subject: {chatSubject}
                  </Badge>
                ) : (
                  <Badge colorScheme="gray" variant="subtle">
                    No Chat Subject
                  </Badge>
                )}
              </div>
            ) : (
              <Link href={"/chat"}>
                <Button
                  type="button"
                  label="Chat"
                  variant={ButtonVariant.Default}
                />
              </Link>
            )}
            <AccountMenu />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
