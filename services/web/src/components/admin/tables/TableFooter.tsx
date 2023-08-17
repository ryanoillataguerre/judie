import { Button, Flex, Text } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const TableFooter = ({
  page,
  setPage,
  totalPageCount,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPageCount: number;
}) => {
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      mt={4}
      flexDir={{ base: "column", md: "row" }}
    >
      <Button
        variant={"ghost"}
        onClick={() => {
          setPage?.((page || 1) - 1);
        }}
        isDisabled={page === 1}
        size={"sm"}
      >
        <FiArrowLeft size={16} />
      </Button>
      <Text fontSize={14} color={"gray.400"}>
        Page {page || 1} of {totalPageCount}
      </Text>
      <Button
        isDisabled={totalPageCount - page === 0}
        variant={"ghost"}
        onClick={() => {
          setPage?.((page || 1) + 1);
        }}
        size={"sm"}
      >
        <FiArrowRight size={16} />
      </Button>
    </Flex>
  );
};

export default TableFooter;
