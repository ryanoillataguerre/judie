import { Button, Input, Tooltip, useToast } from "@chakra-ui/react";
import { ChatContext } from "@judie/hooks/useChat";
import { useRouter } from "next/router";
import { FormEvent, useContext, useRef } from "react";

const AssignmentUploader = ({}: {}) => {
  const toast = useToast();
  const chatId = useRouter().query.id;
  const { uploadAssignment, streaming } = useContext(ChatContext);
  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", (e.target as any).files[0]);
    if (!chatId) {
      toast({
        status: "error",
        title: "Error",
        description: "Must be in a chat to upload context",
      });
      return;
    }
    uploadAssignment(formData);
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Tooltip
        label={"Upload an assignment to give Judie context"}
        placement={"top"}
        padding={2}
        borderRadius={4}
        isDisabled={streaming}
      >
        <Button
          h={"fit-content"}
          w={"unset"}
          minW={"unset"}
          py={"12px"}
          px={"12px"}
          mr={"12px"}
          type={"button"}
          size={"sm"}
          fontSize={"16px"}
          borderRadius={"24px"}
          variant={"purp"}
          lineHeight={"1.375rem"}
          onClick={() => {
            inputRef.current?.click();
          }}
          isLoading={streaming}
          isDisabled={streaming}
        >
          Upload
        </Button>
        {/* TODO: Get this to only accept PDFs */}
      </Tooltip>
      <Input
        p={0}
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
