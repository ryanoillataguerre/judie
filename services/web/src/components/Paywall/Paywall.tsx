import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import useAuth from "@judie/hooks/useAuth";
import styles from "./Paywall.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubscriptionStatus } from "@judie/data/types/api";
import { useMutation, useQuery } from "react-query";
import {
  CREATE_CHECKOUT_SESSION,
  createCheckoutSessionMutation,
} from "@judie/data/mutations";
import { useRouter } from "next/router";

const SubscribeCard = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => {
  return (
    // TODO: WTF?
    // eslint-disable-next-line
    <div
      className={styles.subscribeCard}
      onClick={loading ? () => {} : onClick}
    >
      {loading ? (
        <Spinner height={12} width={12} color={"#3d7d72"} />
      ) : (
        <>
          <div className={styles.priceContainer}>
            <h1 className={styles.price}>$29</h1>
            <p className={styles.priceInterval}>/mo</p>
          </div>
          <div className={styles.descriptionContainer}>
            <h1>Judie Premium</h1>
            <p>
              Unlimited questions, study guides, more tailored responses,
              customized quizzes coming soon, and more.
            </p>
          </div>
        </>
      )}
    </div>
  );
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
  }, [userData]);

  const currentUrl = useMemo(() => {
    return typeof window !== "undefined" ? window?.location?.href : "";
  }, []);

  const {
    data: checkoutSessionUrl,
    mutate,
    isLoading,
  } = useMutation({
    mutationKey: CREATE_CHECKOUT_SESSION,
    mutationFn: () => createCheckoutSessionMutation(currentUrl),
  });

  const onClick = useCallback(() => {
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
          <ModalFooter>
            <SubscribeCard onClick={onClick} loading={loading} />
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default Paywall;
