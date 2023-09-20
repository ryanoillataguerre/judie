import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  IconButton,
  Input,
  useEditableControls,
} from "@chakra-ui/react";
import { AiOutlineCheck } from "react-icons/ai";
import { TbPencil } from "react-icons/tb";

const EditButton = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();
  return (
    <IconButton
      aria-label="Edit Chat Title"
      variant="ghost"
      size="sm"
      zIndex={100}
      {...(isEditing ? getSubmitButtonProps() : getEditButtonProps())}
      icon={
        isEditing ? (
          <AiOutlineCheck size={18} color={"#A3A3A3"} />
        ) : (
          <TbPencil size={18} color="#A3A3A3" />
        )
      }
    />
  );
};

interface EditableTitleProps {
  title: string | undefined;
  onChange: (value: string) => void;
}
const EditableTitle = ({ title, onChange }: EditableTitleProps) => {
  return (
    <Editable
      defaultValue={title}
      placeholder={title}
      style={{
        fontSize: "2rem",
      }}
      isPreviewFocusable={false}
      submitOnBlur={false}
      onSubmit={onChange}
    >
      <HStack alignItems={"center"}>
        <EditablePreview cursor="pointer" />
        <Input textAlign={"start"} as={EditableInput} />
        <EditButton />
      </HStack>
    </Editable>
  );
};

export default EditableTitle;
