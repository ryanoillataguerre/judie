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
import Paywall from "../Paywall/Paywall";

const getColorSchemeFromQuestionsAsked = (questionsAsked?: number) => {
  const numToColorSchemeMap: { [key: number]: string } = {
    0: "green",
    1: "yellow",
    2: "red",
    3: "red",
  };
  return numToColorSchemeMap[questionsAsked || 0];
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
        description: (
          <div className={styles.toastDescription}>
            <p>Welcome to Judie&apos;s Unlimited plan </p>
            <p>Good luck with your studies! 🎉</p>
          </div>
        ),
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
      delete router.query.paid;
      router.replace(router.asPath.split("?")[0], {
        query: router.query,
      });
    }
  }, [router, toast]);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Paywall isOpen={isPaywallOpen} setIsOpen={setIsPaywallOpen} />
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
                {auth?.isPaid ? null : (
                  <Badge
                    cursor={"pointer"}
                    onClick={() => setIsPaywallOpen(true)}
                    colorScheme={getColorSchemeFromQuestionsAsked(
                      auth?.userData?.questionsAsked
                    )}
                    variant="subtle"
                  >
                    Chats remaining today:{" "}
                    {3 - (auth?.userData?.questionsAsked || 0)}
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
            <AccountMenu setIsPaywallOpen={setIsPaywallOpen} />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
