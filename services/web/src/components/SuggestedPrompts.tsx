import {
  Flex,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { subjectToSuggestedPromptsMap } from "@judie/data/static/subjects";
import { useMemo } from "react";

const SuggestedPrompts = ({
  subject,
  onSelect,
}: {
  subject?: string;
  onSelect: (prompt: string) => void;
}) => {
  const bg = useColorModeValue("purple.200", "purple.600");
  const prompts = useMemo(() => {
    if (subject) {
      return subjectToSuggestedPromptsMap[subject];
    }
    return [];
  }, [subject]);

  const paddingX = useBreakpointValue({ base: 6, md: 12 });
  return prompts?.length ? (
    <Flex
      width={"100%"}
      flexDirection={"column"}
      alignItems={"center"}
      paddingY={2}
      borderRadius={4}
      marginY={1}
      paddingX={paddingX}
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
