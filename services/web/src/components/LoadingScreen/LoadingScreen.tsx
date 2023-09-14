import Lottie from "lottie-react";
import loadingAnimationData from "@judie/styles/lottie/loading-animation.json";
import { Box, Flex } from "@chakra-ui/react";

const LoadingScreen = () => {
  return (
    <Flex
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        style={{
          height: "30%",
          marginRight: "5%",
        }}
      >
        <Lottie animationData={loadingAnimationData} loop />
      </Box>
    </Flex>
  );
};

export default LoadingScreen;
