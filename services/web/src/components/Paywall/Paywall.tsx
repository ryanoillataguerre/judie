import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Flex,
  Box,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubscriptionStatus } from "@judie/data/types/api";
import { useMutation } from "react-query";
import {
  CREATE_CHECKOUT_SESSION,
  createCheckoutSessionMutation,
} from "@judie/data/mutations";
import { useRouter } from "next/router";
import * as gtag from "@judie/utils/gtag";

const SubscribeCard = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => {
  const cardHoverBgColor = useColorModeValue("gray.200", "gray.800");
  return (
    <Flex
      style={{
        width: "max-content",
        height: "100%",
        cursor: "pointer",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      boxShadow="md"
      onClick={loading ? () => {} : onClick}
    >
      {loading ? (
        <Flex
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
          _hover={{
            backgroundColor: cardHoverBgColor,
            transition: "all .2s ease-in-out",
          }}
        >
          <Spinner height={12} width={12} colorScheme={"teal"} />
        </Flex>
      ) : (
        <Flex
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
          _hover={{
            backgroundColor: cardHoverBgColor,
            transition: "all .2s ease-in-out",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginRight: ".2rem",
              }}
            >
              $49
            </Text>
            <Text
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginRight: "1rem",
              }}
            >
              /mo
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              Judie Premium
            </Text>
            <Text
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              Unlimited questions, study guides, more tailored responses,
              customized quizzes coming soon, and more.
            </Text>
          </Box>
        </Flex>
      )}
    </Flex>
  );
  // <div
  //   className={styles.subscribeCard}
  //   onClick={loading ? () => {} : onClick}
  // >
  //   {loading ? (
  //     <Spinner height={12} width={12} color={"#3d7d72"} />
  //   ) : (
  //     <>
  // <div className={styles.priceContainer}>
  //   <h1 className={styles.price}>$29</h1>
  //   <p className={styles.priceInterval}>/mo</p>
  // </div>
  // <div className={styles.descriptionContainer}>
  //   <h1>Judie Premium</h1>
  //   <p>
  //     Unlimited questions, study guides, more tailored responses,
  //     customized quizzes coming soon, and more.
  //   </p>
  // </div>
  //     </>
  //   )}
  // </div>
};

const Paywall = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  useEffect(() => {
    // If user is subbed, do not open paywall
    if (userData?.subscription?.status === SubscriptionStatus.ACTIVE) {
      setIsOpen(false);
      return;
    }
  }, [userData, setIsOpen]);

  const router = useRouter();
  const currentUrl = useMemo(() => {
    return typeof window !== "undefined"
      ? `${window.location.origin}${router.asPath}`
      : "";
  }, [router]);

  const {
    data: checkoutSessionUrl,
    mutate,
    isLoading,
  } = useMutation({
    mutationKey: CREATE_CHECKOUT_SESSION,
    mutationFn: () => createCheckoutSessionMutation(currentUrl),
  });

  const onClick = useCallback(() => {
    gtag.event({
      action: "click",
      category: "subscribe",
      label: "subscribe",
      value: null,
    });
    if (!checkoutSessionUrl && !isLoading) {
      setLoading(true);
      mutate();
    }
  }, [mutate, checkoutSessionUrl, isLoading, setLoading]);

  useEffect(() => {
    if (checkoutSessionUrl) {
      window?.location?.assign(checkoutSessionUrl);
    }
  }, [checkoutSessionUrl]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            padding: "1rem",
          }}
        >
          <ModalHeader>
            <Text variant={"header"}>
              We&apos;re so glad you&apos;re here learning with us 🎉
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text variant={"subheading"}>
              Click below to start your free trial and get unlimited access to
              Judie.
            </Text>
          </ModalBody>
          <ModalFooter
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              width={"100%"}
              variant={"purp"}
              bgColor={"green.400"}
              _hover={{
                bgColor: "green.500",
              }}
              isLoading={loading}
              onClick={onClick}
            >
              Start your free trial
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default Paywall;
