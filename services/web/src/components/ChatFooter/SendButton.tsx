import { Button, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import SendIcon from "../icons/SendIcon";

const SendButton = () => {
  const sendColor = useColorModeValue("gray.800", "gray.300");

  return (
    <Button
      type="submit"
      alignSelf={"flex-end"}
      height={"fit-content"}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      _hover={{
        backgroundColor: "brand.secondary",
        svg: {
          fill: "gray.200",
        },
      }}
      px={2.5}
      py={3}
      border={"none"}
      bg={"transparent"}
    >
      <SendIcon color={sendColor} boxSize={6} />
    </Button>
  );
};

export default SendButton;
