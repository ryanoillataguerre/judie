import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useAuth from "@judie/hooks/useAuth";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { useMutation } from "react-query";
import { ageAndConsentMutation } from "@judie/data/mutations";

interface SubmitData {
  dob: string;
  parentEmail?: string;
}

const AgeModal = () => {
  const auth = useAuth();
  const toast = useToast();

  const isOpen = useMemo(() => {
    if (auth.isB2B || !auth.userData?.parentalConsent) {
      return false;
    }
    const dobDate = new Date(auth.userData?.dateOfBirth || "");
    if (isNaN(dobDate.getTime())) {
      return true;
    }
    const now = new Date();
    const diff = now.getTime() - dobDate.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (
      // User has not entered DOB
      (auth.userData?.id && !auth.userData.dateOfBirth) ||
      // User is under 13 and has not entered parental consent email
      (auth.userData?.dateOfBirth &&
        age < 13 &&
        !auth.userData?.parentalConsent)
    ) {
      return true;
    }
    return false;
  }, [
    auth?.userData?.dateOfBirth,
    auth.userData?.parentalConsent,
    auth.userData?.parentalConsentEmail,
  ]);

  const { handleSubmit, register, reset, watch } = useForm<SubmitData>({
    defaultValues: {
      dob: undefined,
      parentEmail: undefined,
    },
    reValidateMode: "onBlur",
  });

  const dobAndConsentMutation = useMutation({
    mutationFn: ageAndConsentMutation,
    onSuccess: () => {
      auth.refresh();
      toast({
        title: "Date of birth saved.",
        description:
          "Thanks. Please have your parent check their email and click the link before you can proceed using Judie.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<SubmitData> = async ({
    dob,
    parentEmail,
  }: SubmitData) => {
    try {
      await dobAndConsentMutation.mutateAsync({
        dateOfBirth: dob,
        parentEmail,
      });
    } catch (err) {
      toast({
        title: "Error setting DOB",
        description: (err as unknown as HTTPResponseError).message,
      });
    }
  };

  const dob = watch("dob");

  const isDateValid = useMemo(() => {
    // Is date in the past 100 years?
    if (!dob) {
      return false;
    }
    const dobDate = new Date(dob);
    // If date is invalid, don't show email form yet
    if (isNaN(dobDate.getTime())) {
      return false;
    }
    const now = new Date();
    const diff = now.getTime() - dobDate.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (age >= 100) {
      return false;
    }
    return true;
  }, [dob]);

  const isUserOver13 = useMemo(() => {
    // Is DOB >13yr ago?
    const dobDate = new Date(dob);
    const now = new Date();
    const diff = now.getTime() - dobDate.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (age >= 13) {
      return true;
    }
    return false;
  }, [dob]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />
      <ModalContent py={8}>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text variant={"title"}>Please enter your date of birth</Text>
          <Text
            variant={"subtitle"}
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            We need to know your date of birth to verify whether or not you need
            parental consent to use Judie.
          </Text>

          <Text
            variant={"subtitle"}
            style={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            If you&apos;ve already sent them an email, please ask them to check
            their inbox or spam folder.
          </Text>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
            }}
          >
            <Flex
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                paddingBottom: "1rem",
              }}
            >
              <FormControl
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
                isRequired
              >
                <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                <Input
                  type={"date"}
                  id="dob"
                  required
                  {...register("dob", {})}
                />
              </FormControl>
              {isDateValid && !isUserOver13 && (
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired
                >
                  <FormLabel htmlFor="parentEmail">
                    Parent&apos;s email address
                  </FormLabel>
                  <Input
                    type={"email"}
                    id="parentEmail"
                    required
                    {...register("parentEmail", {})}
                  />
                </FormControl>
              )}
              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                variant={"purp"}
                disabled={!isDateValid || (isDateValid && !isUserOver13)}
                isLoading={dobAndConsentMutation.isLoading}
                type="submit"
              >
                Submit
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AgeModal;
