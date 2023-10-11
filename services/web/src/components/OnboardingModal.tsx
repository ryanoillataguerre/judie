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
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { getUserSubjectsForGradeYear } from "@judie/data/static/subjects";
import {
  GradeYear,
  PrepForTest,
  Purpose,
  UserProfile,
  getGradeYearName,
  getPurposeName,
} from "@judie/data/types/api";
import useAuth from "@judie/hooks/useAuth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface SubmitData extends Omit<UserProfile, "createdAt" | "updatedAt"> {}

const OnboardingModal = () => {
  const { userData } = useAuth();
  const { handleSubmit, register, reset, watch } = useForm<SubmitData>({
    defaultValues: {
      purpose: userData?.profile?.purpose || undefined,
      prepForTest: (userData?.profile?.prepForTest as PrepForTest) || undefined,
      gradeYear: (userData?.profile?.gradeYear as GradeYear) || undefined,
      country: userData?.profile?.country || undefined,
      state: userData?.profile?.state || undefined,
      subjects: userData?.profile?.subjects || [],
    },
    reValidateMode: "onBlur",
  });
  const purpose = watch("purpose");
  const prepForTest = watch("prepForTest");
  const gradeYear = watch("gradeYear");
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const onSubmit: SubmitHandler<SubmitData> = async ({}: SubmitData) => {
    try {
      // Set cookie saying we've attempted submission recently
      // await dobAndConsentMutation.mutateAsync({
      //   dateOfBirth: dob,
      //   parentEmail,
      // });
    } catch (err) {
      toast({
        title: "Error submitting, please try again later.",
        description: (err as unknown as HTTPResponseError).message,
      });
    }
  };

  // Closable
  // Only show on dashboard
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
          <Text variant={"title"}>Welcome to Judie!</Text>
          <Text
            variant={"subtitle"}
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            We'd love to know what brings you to Judie, so we can make your
            experience (and Judie's responses) even better.
          </Text>
          <Text
            variant={"subtitle"}
            style={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            Please tell us a little about what brought you here today.
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
                <FormLabel htmlFor="purpose">Purpose</FormLabel>
                <Select id="purpose" {...register("purpose", {})}>
                  <option value={undefined}>{"None"}</option>
                  {/* TODO Ryan: Make user-facing versions of these */}
                  {Object.keys(Purpose).map((key) => (
                    <option value={key} key={key}>
                      {getPurposeName(key as unknown as Purpose)}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {purpose === Purpose.TEST_PREP && (
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired
                >
                  <FormLabel htmlFor="prepForTest">
                    Which test are you prepping for?
                  </FormLabel>
                  <Select id="prepForTest" {...register("prepForTest", {})}>
                    <option value={undefined}>{"None"}</option>
                    {/* TODO Ryan: Make user-facing versions of these */}
                    {Object.keys(PrepForTest).map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              {(purpose === Purpose.TEST_PREP &&
                (prepForTest === PrepForTest.SAT ||
                  prepForTest === PrepForTest.ACT)) ||
              purpose === Purpose.CLASSES ||
              purpose === Purpose.HOMESCHOOLING ? (
                // gradeYear
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired
                >
                  <FormLabel htmlFor="gradeYear">
                    What grade are you in?
                  </FormLabel>
                  <Select id="gradeYear" {...register("gradeYear", {})}>
                    <option value={undefined}>{"None"}</option>
                    {/* TODO Ryan: Make user-facing versions of these */}
                    {Object.keys(GradeYear).map((key) => (
                      <option value={key} key={key}>
                        {getGradeYearName(key as unknown as GradeYear)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              {(purpose === Purpose.CLASSES ||
                purpose === Purpose.HOMESCHOOLING) &&
              !!gradeYear ? (
                // subjects
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <FormLabel htmlFor="subjects">
                    What subjects are you studying?
                  </FormLabel>
                  <Text
                    variant={"subtitle"}
                    style={{
                      marginTop: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Don't worry if some of yours aren't on here - Judie can
                    handle the broadest range of questions!
                  </Text>
                  <Select id="subjects" {...register("subjects")} multiple>
                    {/* TODO Ryan: Make user-facing versions of these */}
                    {getUserSubjectsForGradeYear(gradeYear).map((key) => (
                      <option value={key} key={key}>
                        {getGradeYearName(key as unknown as GradeYear)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}

              {/* <Button
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
              </Button> */}
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OnboardingModal;
