import {
  Button,
  Input,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ChatContext } from "@judie/hooks/useChat";
import { useRouter } from "next/router";
import { FormEvent, useContext, useRef } from "react";
import { AttachmentIcon } from "@chakra-ui/icons";

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

  const paperClipColor = useColorModeValue("gray.800", "gray.300");
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
          type="button"
          alignSelf={"flex-end"}
          // variant="outline"
          // colorScheme="teal"
          bg={"transparent"}
          style={{
            height: "fit-content",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          px={1.5}
          py={4}
          _hover={{
            backgroundColor: "brand.secondary",
            svg: {
              stroke: "gray.200",
            },
          }}
          borderRadius={"10px"}
          border={"none"}
          onClick={() => {
            inputRef.current?.click();
          }}
          isLoading={streaming}
          isDisabled={streaming}
        >
          <AttachmentIcon color={paperClipColor} />
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
