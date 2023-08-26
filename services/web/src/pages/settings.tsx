import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormHelperText,
  Heading,
  Divider,
  InputLeftElement,
  FormErrorMessage,
  InputGroup,
  VStack,
  HStack,
  Spacer,
  Avatar,
  DarkMode,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import InputField from "@judie/components/settings/InputField";
import { Search2Icon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import useAuth from "@judie/hooks/useAuth";
import SidebarPageContainer from "@judie/components/SidebarPageContainer/SidebarPageContainer";
import {
  GET_PORTAL_LINK,
  getBillingPortalLinkQuery,
} from "@judie/data/queries";
import Head from "next/head";
import RoundButton from "@judie/components/RoundButton/RoundButton";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { putUserMutation } from "@judie/data/mutations";

interface ChangePasswordSubmitData {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

interface ChangeNameSubmitData {
  firstName: string;
  lastName: string;
}

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const { userData, logout } = useAuth();
  const toast = useToast();

  const {
    handleSubmit: passwordHandleSubmit,
    register: passwordRegister,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSumbitting },
  } = useForm<ChangePasswordSubmitData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
    reValidateMode: "onBlur",
  });

  const {
    handleSubmit: profileHandleSubmit,
    register: profileRegister,
    formState: { errors: profileErrors, isSubmitting: isProfileSumbitting },
  } = useForm<ChangeNameSubmitData>({
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
    },
    reValidateMode: "onBlur",
  });

  const { mutateAsync: userMutateAsync, isLoading: userMutateIsLoading } =
    useMutation({
      mutationFn: putUserMutation,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your profile has been updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      onError: (err: HTTPResponseError) => {
        console.error("Error updating profile", err);
        toast({
          title: "Error updating profile",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });

  const {
    mutateAsync: passwordMutateAsync,
    isLoading: passwordMutateIsLoading,
  } = useMutation({
    // TODO add mutationFn
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your password has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (err: HTTPResponseError) => {
      console.error("Error updating password", err);
      toast({
        title: "Error updating password",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  async function onSubmitUserInfo({ firstName, lastName }: any) {
    try {
      await userMutateAsync({
        firstName,
        lastName,
      });
    } catch (err) {}
  }

  async function onSubmitPasswordInfo({
    oldPassword,
    newPassword,
    repeatPassword,
  }: any) {
    try {
      // await passwordMutateAsync({
      //   oldPassword,
      //   newPassword,
      //   repeatPassword,
      // });
    } catch (err) {}
  }

  const getBillingPortal = useQuery(GET_PORTAL_LINK, {
    queryFn: getBillingPortalLinkQuery,
    enabled: false,
    onSuccess: (data) => {
      window.open(data, "_blank");
    },
  });
  return (
    <>
      <Head>
        <title>Judie - Settings</title>
        <meta
          name="description"
          content="Welcome to Judie! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SidebarPageContainer>
          <Flex py={"20px"} pl={"30px"} pr={"20px"}>
            <Flex
              boxShadow={"xl"}
              style={{
                height: "100%",
                width: "100%",
                padding: "20px 30px",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                borderRadius: "22px",
              }}
            >
              <Flex pt={30} w="100%">
                <VStack spacing={"5px"} alignItems={"flex-start"}>
                  <Heading as="h1" fontSize={"24px"}>
                    Settings
                  </Heading>
                  <Text>Manage your account</Text>
                </VStack>
                <Spacer />
                {/* <Flex flexGrow={1} maxW={502} alignItems={"center"}>
                  <InputGroup>
                    <InputLeftElement
                      py={15}
                      h={54}
                      pl={4}
                      pointerEvents="none"
                      children={<Search2Icon color="gray.300" />}
                    />
                    <Input
                      borderRadius={"100px"}
                      py={15}
                      pl={45}
                      h={54}
                      type="text"
                      placeholder="Search in Settings"
                    />
                  </InputGroup>
                </Flex> */}
              </Flex>
              <Divider my={"30px"} />
              <Flex
                w="calc(100% + 60px)"
                ml={"-30px"}
                p={15}
                bg="brand.primary"
                color={"white"}
                borderRadius={11}
                h={{ base: "auto", lg: "104px" }}
                mt={"10px"}
                mb={"40px"}
                direction={{ base: "column", lg: "row" }}
                gap={{ base: "15px", md: "0px" }}
              >
                <Flex alignItems={"center"}>
                  <Avatar
                    mr={"10px"}
                    borderRadius="full"
                    boxSize="74px"
                    src=""
                  />
                  <Flex flexDirection={"column"} gap={"5px"}>
                    <Text
                      fontSize={18}
                    >{`${userData?.firstName} ${userData?.lastName}`}</Text>
                    <Text fontSize={14} color="gray.400">
                      {userData?.email}
                    </Text>
                  </Flex>
                </Flex>
                <Spacer display={{ base: "none", md: "block" }} />
                <Flex justifyContent={"center"} gap={"15px"}>
                  <DarkMode>
                    <RoundButton
                      text="Manage Billing"
                      fontSize={{ base: "16px", lg: "18px" }}
                      onClick={() => getBillingPortal.refetch()}
                    />
                    <RoundButton
                      text="Log out"
                      fontSize={{ base: "16px", lg: "18px" }}
                      onClick={() => {
                        logout();
                      }}
                    />
                  </DarkMode>
                </Flex>
              </Flex>
              <VStack w={"100%"} spacing={"30px"}>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  w={"100%"}
                  gap={{ base: "10px", lg: "50px" }}
                >
                  <Flex minW={"216px"} direction={"column"} gap={"5px"}>
                    <Text fontSize={16} fontWeight={600}>
                      Your Details
                    </Text>
                    <Text>All the information about you</Text>
                  </Flex>
                  <Divider display={{ base: "block", lg: "none" }} />

                  <Box
                    as="form"
                    display={"flex"}
                    flexDirection={"column"}
                    onSubmit={profileHandleSubmit(onSubmitUserInfo)}
                    w={"100%"}
                    gap={"20px"}
                  >
                    <VStack gap={{ base: "15px", xl: "10px" }} w={"100%"}>
                      <Flex
                        direction={{ base: "column", xl: "row" }}
                        w={"100%"}
                        gap={"15px"}
                      >
                        <Flex w={"100%"} direction="column">
                          <FormLabel>First Name</FormLabel>

                          <Input
                            placeholder={"First Name"}
                            defaultValue={userData?.firstName}
                            {...profileRegister("firstName", {
                              required: "This is required",
                              minLength: {
                                value: 4,
                                message: "Minimum length should be 4",
                              },
                            })}
                          />
                        </Flex>
                        <Flex w={"100%"} direction={"column"}>
                          <FormLabel>Last Name</FormLabel>

                          <Input
                            placeholder={"Last Name"}
                            defaultValue={userData?.lastName}
                            {...profileRegister("lastName", {})}
                          />
                        </Flex>
                      </Flex>
                      <Flex
                        direction={{ base: "column", xl: "row" }}
                        w={"100%"}
                        gap={{ base: "0px", xl: "15px" }}
                      >
                        <Flex w={"100%"} direction={"column"}>
                          {/* <FormLabel>Phone Number</FormLabel>
                          <InputField
                            type="number"
                            placeholder="🇮🇹 +39 | 3335839398"
                          ></InputField> */}
                          <Spacer />
                        </Flex>
                        <Flex w={"100%"} direction="column">
                          <FormLabel>Mail</FormLabel>
                          <InputField
                            type={"email"}
                            placeholder="judie@judie.io"
                            value={userData?.email}
                            isReadOnly
                          ></InputField>
                        </Flex>
                      </Flex>
                    </VStack>
                    <RoundButton
                      fontSize={{ base: "16px", lg: "18px" }}
                      alignSelf={{ base: "center", md: "flex-end" }}
                      text="Update Details"
                      type="submit"
                      loading={isProfileSumbitting}
                    />
                  </Box>
                </Flex>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  w={"100%"}
                  gap={{ base: "10px", lg: "50px" }}
                >
                  <Flex minW={"216px"} direction={"column"} gap={"5px"}>
                    <Text fontSize={16} fontWeight={600}>
                      Security
                    </Text>
                    <Text>Check or change password</Text>
                  </Flex>
                  <Divider display={{ base: "block", lg: "none" }} />
                  <Flex
                    as="form"
                    w={"100%"}
                    direction={"column"}
                    gap={"20px"}
                    onSubmit={passwordHandleSubmit(onSubmitPasswordInfo)}
                  >
                    <VStack gap={{ base: "15px", xl: "10px" }} w={"100%"}>
                      <Flex
                        direction={{ base: "column", xl: "row" }}
                        w={"100%"}
                        gap={"15px"}
                      >
                        <Flex w={"100%"} direction="column">
                          <FormLabel>Current password</FormLabel>
                          <InputGroup size="md">
                            <InputRightElement>
                              <IconButton
                                variant="link"
                                aria-label={
                                  showPassword
                                    ? "Mask password"
                                    : "Reveal password"
                                }
                                icon={showPassword ? <HiEyeOff /> : <HiEye />}
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            </InputRightElement>
                            <Input
                              type={showPassword ? "text" : "password"}
                              isRequired
                              placeholder="*********"
                              {...passwordRegister("oldPassword", {})}
                            ></Input>
                          </InputGroup>
                        </Flex>
                        <Flex w={"100%"} direction={"column"}>
                          <FormLabel>New password</FormLabel>
                          <InputGroup size="md">
                            <InputRightElement>
                              <IconButton
                                variant="link"
                                aria-label={
                                  showNewPassword
                                    ? "Mask password"
                                    : "Reveal password"
                                }
                                icon={
                                  showNewPassword ? <HiEyeOff /> : <HiEye />
                                }
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              />
                            </InputRightElement>
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              isRequired
                              placeholder="Write here"
                              {...passwordRegister("newPassword", {})}
                            ></Input>
                          </InputGroup>
                        </Flex>
                      </Flex>
                      <Flex
                        direction={{ base: "column", xl: "row" }}
                        w={"100%"}
                        gap={{ base: "0px", xl: "15px" }}
                      >
                        <Flex w={"100%"} direction="column">
                          <Spacer />
                        </Flex>

                        <Flex w={"100%"} direction={"column"}>
                          <FormLabel>Confirm new password</FormLabel>
                          <InputGroup size="md">
                            <InputRightElement>
                              <IconButton
                                variant="link"
                                aria-label={
                                  showRepeatPassword
                                    ? "Mask password"
                                    : "Reveal password"
                                }
                                icon={
                                  showRepeatPassword ? <HiEyeOff /> : <HiEye />
                                }
                                onClick={() =>
                                  setShowRepeatPassword(!showRepeatPassword)
                                }
                              />
                            </InputRightElement>
                            <InputField
                              type={showRepeatPassword ? "text" : "password"}
                              placeholder="Write here"
                              {...passwordRegister("repeatPassword", {})}
                            ></InputField>
                          </InputGroup>
                        </Flex>
                      </Flex>
                    </VStack>
                    <RoundButton
                      fontSize={{ base: "16px", lg: "18px" }}
                      alignSelf={{ base: "center", md: "flex-end" }}
                      mb={"80px"}
                      text="Update Password"
                      type="submit"
                      loading={passwordMutateIsLoading}
                    />
                  </Flex>
                </Flex>
                {/* <Flex
                  direction={{ base: "column", lg: "row" }}
                  w={"100%"}
                  gap={{ base: "10px", lg: "50px" }}
                >
                  <Flex minW={"216px"} direction={"column"} gap={"5px"}>
                    <Text fontSize={16} fontWeight={600}>
                      Language
                    </Text>
                    <Text>What do you prefer?</Text>
                  </Flex>
                  <Divider display={{ base: "block", lg: "none" }} />
                  <VStack gap={"10px"} w={"100%"}>
                    <Flex
                      direction={{ base: "column", xl: "row" }}
                      w={"100%"}
                      gap={"15px"}
                      mb={"85px"}
                    >
                      <Flex w={"100%"} direction="column">
                        <FormLabel>Choose a language</FormLabel>
                        <Select>
                          <option value="option1">🇬🇧 English</option>
                          <option value="option2">🇪🇸 Spanish</option>
                          <option value="option3">🇫🇷 French</option>
                        </Select>
                      </Flex>
                      <Flex w={"100%"} direction={"column"}>
                        <Spacer />
                      </Flex>
                    </Flex>
                  </VStack>
                </Flex> */}
              </VStack>

              {/* <Text fontWeight="bold" fontSize={"2rem"} marginBottom={"1rem"}>
                Manage Billing
              </Text> */}
            </Flex>
          </Flex>
        </SidebarPageContainer>
      </main>
    </>
  );
};

SettingsPage.displayName = "Settings";

export default SettingsPage;
