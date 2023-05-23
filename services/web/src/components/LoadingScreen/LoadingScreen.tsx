import Lottie from "lottie-react";
import loadingAnimationData from "@judie/styles/lottie/loading-animation.json";
import styles from "./LoadingScreen.module.scss";
import { Box, Flex } from "@chakra-ui/react";

const LoadingScreen = () => {
  return (
    <Flex
      style={{
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        paddingBottom: "50%",
        justifyContent: "center",
        backgroundColor: "teal",
      }}
    >
      <Box
        style={{
          height: "30%",
        }}
      >
        <Lottie animationData={loadingAnimationData} loop />
      </Box>
    </Flex>
  );
};

export default LoadingScreen;
