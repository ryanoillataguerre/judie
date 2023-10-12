import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { onboardMutation } from "@judie/data/mutations";
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
import { MultiSelect } from "chakra-multiselect";
import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

const states = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Federated States of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Island",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const countries = [
  "United States of America",
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas (the)",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory (the)",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands (the)",
  "Central African Republic (the)",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands (the)",
  "Colombia",
  "Comoros (the)",
  "Congo (the Democratic Republic of the)",
  "Congo (the)",
  "Cook Islands (the)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic (the)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
  "Gabon",
  "Gambia (the)",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (the)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (the Democratic People's Republic of)",
  "Korea (the Republic of)",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic (the)",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands (the)",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (the Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (the)",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger (the)",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands (the)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines (the)",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of North Macedonia",
  "Romania",
  "Russian Federation (the)",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan (the)",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands (the)",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates (the)",
  "United Kingdom of Great Britain and Northern Ireland (the)",
  "United States Minor Outlying Islands (the)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Åland Islands",
];
export interface SubmitData
  extends Omit<UserProfile, "createdAt" | "updatedAt"> {}

const OnboardingModal = () => {
  const { userData, refresh } = useAuth();
  const { handleSubmit, register, reset, watch } = useForm<SubmitData>({
    defaultValues: {
      purpose: userData?.profile?.purpose || undefined,
      prepForTest: (userData?.profile?.prepForTest as PrepForTest) || undefined,
      gradeYear: (userData?.profile?.gradeYear as GradeYear) || undefined,
      country: userData?.profile?.country || undefined,
      state: userData?.profile?.state || undefined,
    },
    reValidateMode: "onBlur",
  });
  const [subjects, setSubjects] = useState<
    string | number | (string | number)[]
  >([]);
  const purpose = watch("purpose");
  const prepForTest = watch("prepForTest");
  const gradeYear = watch("gradeYear");
  const country = watch("country");
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const onboardedRecently = getCookie("onboarded_closed_recently");

  useEffect(() => {
    if (userData && !userData?.profile?.purpose && !onboardedRecently) {
      setIsOpen(true);
    }
  }, [userData?.profile, onboardedRecently]);

  const onboardingMutation = useMutation({
    mutationFn: onboardMutation,
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
        status: "success",
      });
      refresh();
      // Wait for 1 second
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    },
  });

  const onSubmit: SubmitHandler<SubmitData> = async ({
    purpose: purposeRaw,
    prepForTest: prepForTestRaw,
    gradeYear: gradeYearRaw,
    subjects,
    country: countryRaw,
    state: stateRaw,
  }: SubmitData) => {
    try {
      await onboardingMutation.mutateAsync({
        purpose: purposeRaw,
        prepForTest: prepForTestRaw,
        gradeYear: gradeYearRaw,
        subjects: subjects as unknown as string[],
        country: countryRaw,
        state: stateRaw,
      });
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
      onClose={() => {
        setIsOpen(false);
        // Set cookie saying we've tried recently
        setCookie("onboarded_closed_recently", "true", {
          // Expire after 1hr
          maxAge: 60 * 60,
          path: "/",
        });
      }}
      closeOnOverlayClick={false}
      size={"5xl"}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />

      <ModalContent py={8}>
        <ModalCloseButton />
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
                overflowY: "scroll",
                maxHeight: "50vh",
              }}
              paddingX={"0.2rem"}
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
                  {/* <option value={undefined}>{"None"}</option> */}
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
                    {/* <option value={undefined}>{"None"}</option> */}
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
                    {/* <option value={undefined}>{"None"}</option> */}
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
                    variant={"detail"}
                    style={{
                      marginTop: "0.2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Don&apos;t worry if some of yours aren&apos;t on here -
                    Judie can handle a broad range of questions!
                  </Text>
                  <MultiSelect
                    options={getUserSubjectsForGradeYear(gradeYear).map(
                      (key) => ({
                        value: key,
                        label: key,
                      })
                    )}
                    value={subjects}
                    label="Choose some subjects from the list"
                    onChange={setSubjects}
                  />

                  {/* <Select
                    id="subjects"
                    {...register("subjects")}
                    multiple
                    backgroundColor={"blue"}
                  >
                    {getUserSubjectsForGradeYear(gradeYear).map((key) => (
                      <option value={key} key={key}>
                        <Text>
                          {getGradeYearName(key as unknown as GradeYear)}
                        </Text>
                      </option>
                    ))}
                  </Select> */}
                </FormControl>
              ) : null}
              {/* Country if purpose is classes or homeschooling */}
              {(purpose === Purpose.CLASSES ||
                purpose === Purpose.HOMESCHOOLING) &&
              !!gradeYear ? (
                // Country
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired
                >
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <Select id="country" {...register("country", {})}>
                    <option value={undefined}>{"None"}</option>
                    {/* TODO Ryan: Make user-facing versions of these */}
                    {countries.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              {/* State if country is US */}
              {(purpose === Purpose.CLASSES ||
                purpose === Purpose.HOMESCHOOLING) &&
              !!gradeYear &&
              country === "United States of America" ? (
                // State
                <FormControl
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                  isRequired
                >
                  <FormLabel htmlFor="state">State</FormLabel>
                  <Select id="state" {...register("state", {})}>
                    <option value={undefined}>{"None"}</option>
                    {/* TODO Ryan: Make user-facing versions of these */}
                    {states.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </Flex>
            <Button
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              variant={"purp"}
              disabled={!purpose}
              isLoading={onboardingMutation.isLoading}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OnboardingModal;
