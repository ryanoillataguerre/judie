import Lottie from "lottie-react";
import animationData from "@judie/styles/lottie/background-animation.json";
import styles from "./HomepageBackground.module.scss";

const HomepageBackground = () => {
  return (
    <div className={styles.homepageBackground}>
      <Lottie
        animationData={animationData}
        loop
        style={{
          fill: "#d3d3d3",
        }}
      />
    </div>
  );
};

export default HomepageBackground;
