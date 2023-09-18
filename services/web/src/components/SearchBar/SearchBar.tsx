import React from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

type SearchBarProps = {
  title: string;
  searchText: string;
  setSearchText: (searchText: string) => void;
};

// submit on press enter
// clear on esc

const SearchBar = ({ title, searchText, setSearchText }: SearchBarProps) => {
  const toast = useToast();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      toast({
        title: "Table Updated",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    } else if (e.key === "Escape") {
      setSearchText("");
    }
  };

  return (
    <Flex flexGrow={1} alignItems={"center"} justify={"center"}>
      <InputGroup>
        <InputLeftElement py={15} h={54} pl={4} pointerEvents="none">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          borderRadius={"100px"}
          py={15}
          pl={45}
          h={54}
          type="text"
          placeholder={`Search ${title}`}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onKeyDown={onKeyDown}
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchBar;
