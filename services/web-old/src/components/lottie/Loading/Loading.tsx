import Lottie from "lottie-react";
import animationData from "@judie/styles/lottie/loading-animation.json";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <Lottie animationData={animationData} loop />
    </div>
  );
};

export default Loading;
