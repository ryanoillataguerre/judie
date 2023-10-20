import { HStack, Text, VStack } from "@chakra-ui/react";
import { getSuperUsageQuery } from "@judie/data/queries";
import { useQuery } from "react-query";

const SuperUsage = () => {
  const usageQuery = useQuery({
    queryFn: getSuperUsageQuery,
  });

  return (
    <VStack
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "100%",
      }}
    >
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
        paddingLeft={"1rem"}
        paddingTop={"2rem"}
      >
        <Text
          style={{
            fontSize: "2rem",
          }}
        >
          Super Usage
        </Text>
      </HStack>
      <VStack alignItems={"flex-start"} padding={"1rem"}>
        <Text variant={"subheader"}>
          Daily active users: {usageQuery.data?.daily?.count}
        </Text>
        <Text variant={"subheader"}>
          Monthly active users: {usageQuery.data?.monthly?.count}
        </Text>
      </VStack>
    </VStack>
  );
};

export default SuperUsage;
