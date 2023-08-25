import { Input, InputProps as BaseInputProps } from "@chakra-ui/react";

import React from "react";

interface InputFieldProps extends BaseInputProps {
  placeholder: string;
  type?: string;
}

const InputField = ({
  placeholder,
  type = "text",
  ...props
}: InputFieldProps) => {
  return (
    <Input
      py={"10px"}
      px={"12px"}
      h={"42px"}
      placeholder={placeholder}
      type={type}
      {...props}
    ></Input>
  );
};

export default InputField;
