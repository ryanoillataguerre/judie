import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { subjectToSuggestedPromptsMap } from "@judie/data/static/subjects";
import { useMemo } from "react";

const SuggestedPrompts = ({
  subject,
  onSelect,
}: {
  subject?: string;
  onSelect: (prompt: string) => void;
}) => {
  const bg = useColorModeValue("purple.200", "purple.700");
  const prompts = useMemo(() => {
    if (subject) {
      return subjectToSuggestedPromptsMap[subject];
    }
    return [];
  }, [subject]);
  return prompts.length ? (
    <Flex
      width={"100%"}
      flexDirection={"column"}
      alignItems={"center"}
      padding={2}
      borderRadius={4}
      marginY={1}
    >
      <Text variant={"subheader"}>
        Choose a prompt below if you don&apos;t know where to get started
      </Text>
      {prompts.map((prompt) => (
        <Flex
          key={prompt}
          onClick={() => onSelect(prompt)}
          width={"100%"}
          padding={3}
          border={"1px solid #e2e8f0"}
          borderRadius={8}
          marginY={2}
          cursor={"pointer"}
          _hover={{ backgroundColor: bg }}
        >
          {prompt}
        </Flex>
      ))}
    </Flex>
  ) : null;
};

export default SuggestedPrompts;
