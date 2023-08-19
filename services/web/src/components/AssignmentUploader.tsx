import { Button, Input, Tooltip, useToast } from "@chakra-ui/react";
import { uploadAssignmentMutation } from "@judie/data/mutations";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import { useMutation } from "react-query";

const AssignmentUploader = ({}: {}) => {
  const toast = useToast();
  const chatId = useRouter().query.id;
  const uploadMutation = useMutation({
    mutationFn: uploadAssignmentMutation,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Success",
        description: "Assignment uploaded",
      });
    },
  });
  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("event", e);
    let formData = new FormData();
    formData.append("file", (e.target as any).files[0]);
    console.log("file changed");
    if (!chatId) {
      toast({
        status: "error",
        title: "Error",
        description: "Must be in a chat to upload context",
      });
      return;
    }
    uploadMutation.mutate({
      chatId: chatId as string,
      data: formData,
    });
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Tooltip
        label={"Upload an assignment to give Judie context"}
        placement={"top"}
        padding={2}
        borderRadius={4}
        isDisabled={uploadMutation.isLoading || uploadMutation.isSuccess}
      >
        <Button
          // h={"100%"}
          type={"button"}
          colorScheme="teal"
          onClick={() => {
            inputRef.current?.click();
          }}
          isLoading={uploadMutation.isLoading}
          isDisabled={uploadMutation.isLoading || uploadMutation.isSuccess}
        >
          Upload
        </Button>
        {/* TODO: Get this to only accept PDFs */}
      </Tooltip>
      <Input
        ref={inputRef}
        type="file"
        top="0"
        height={"0"}
        width={"0"}
        left="0"
        opacity="0"
        aria-hidden="true"
        accept="pdf"
        onChange={handleFileChange}
      />
    </>
  );
};
export default AssignmentUploader;
