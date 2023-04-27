import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import styles from "./Paywall.module.scss";
import { useEffect, useMemo, useState } from "react";
import { SubscriptionStatus } from "@judie/data/types/api";
import { useQuery } from "react-query";
import {
  GET_CHECKOUT_SESSION,
  getCheckoutSessionQuery,
} from "@judie/data/queries";
import { useRouter } from "next/router";

const Paywall = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  console.log(isOpen);
  const { userData } = useAuth();
  useEffect(() => {
    // If user is subbed, do not open paywall
    if (userData?.subscription?.status === SubscriptionStatus.ACTIVE) {
      setIsOpen(false);
      return;
    }

    console.log("paywall", userData);
  }, [userData]);

  const currentUrl = useMemo(() => {
    return typeof window !== "undefined" ? window?.location?.href : "";
  }, []);

  const { data: checkoutSessionUrl, refetch: fetchCheckoutSession } = useQuery(
    [GET_CHECKOUT_SESSION],
    {
      queryFn: () => getCheckoutSessionQuery(currentUrl),
      enabled: false,
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <div className={styles.modalContentContainer}>
          <ModalHeader>
            <h1>
              Thank you for checking out Judie! We're so glad you're here
              learning with us 🎉
            </h1>
          </ModalHeader>
          <ModalBody>
            <p>
              We're currently in beta, and we're working hard to make Judie the
              best learning experience possible. We're also relying on
              subscriptions to help us keep the lights on.
            </p>
            <br />
            <p>
              In the meantime, we're limiting the number of questions every user
              can ask for free to 10. If you'd like to ask more questions,
              please consider subscribing!
            </p>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default Paywall;
