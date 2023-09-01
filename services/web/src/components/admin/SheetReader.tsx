import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

const SheetReader = <T,>({ onUpload }: { onUpload: (rows: T[]) => void }) => {
  // On upload, parse into rows
  const [rows, setRows] = useState<T[]>([]);
  return (
    <Flex
      width={"100%"}
      height={"100%"}
      borderWidth={"2px"}
      borderColor={"gray.500"}
      borderStyle={"dashed"}
      borderRadius={"md"}
      margin={"1rem 0"}
      padding={"1rem"}
      alignItems={"center"}
      justifyContent={"center"}
      _hover={{
        cursor: "pointer",
        backgroundColor: "gray.600",
      }}
    >
      <Text
        style={{
          margin: "auto",
        }}
      >
        Click here to upload
      </Text>
    </Flex>
  );
};

export default SheetReader;
