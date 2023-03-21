import Lottie from "lottie-react";
import loadingAnimationData from "@judie/styles/lottie/loading-animation.json";
import styles from "./LoadingScreen.module.scss";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingPageContainer}>
      <div className={styles.loadingAnimation}>
        <Lottie
          animationData={loadingAnimationData}
          loop
          style={{
            fill: "#d3d3d3",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
