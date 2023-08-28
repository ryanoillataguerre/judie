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
import { createFolderMutation } from "@judie/data/mutations";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import useAuth from "@judie/hooks/useAuth";
import { HTTPResponseError } from "@judie/data/baseFetch";
import { GET_USER_FOLDERS, getUserFoldersQuery } from "@judie/data/queries";

interface SubmitData {
  title: string;
}

const CreateFolderModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const auth = useAuth();
  const toast = useToast();
  const [success, setSuccess] = useState(false);
  const foldersQuery = useQuery({
    queryKey: [GET_USER_FOLDERS, auth?.userData?.id],
    queryFn: getUserFoldersQuery,
    staleTime: 60000,
    enabled: !!auth?.userData?.id,
  });
  const createFolder = useMutation({
    mutationFn: createFolderMutation,
    onSuccess: () => {
      setSuccess(true);
      reset();
      setIsOpen(false);
      // TODO: Refresh folders
      foldersQuery.refetch();
    },
  });
  const { handleSubmit, register, reset } = useForm<SubmitData>({
    defaultValues: {
      title: "",
    },
    reValidateMode: "onBlur",
  });
  const onSubmit: SubmitHandler<SubmitData> = async ({ title }: SubmitData) => {
    try {
      await createFolder.mutateAsync({
        title,
      });
    } catch (err) {
      toast({
        title: "Error creating organization",
        description: (err as unknown as HTTPResponseError).message,
      });
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" px={"5%"} />
      <ModalContent py={8}>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
          >
            Create a new folder
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
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input id="title" required {...register("title", {})} />
              </FormControl>
              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                variant={"purp"}
                isLoading={createFolder.isLoading}
                type="submit"
              >
                Create Folder
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateFolderModal;
