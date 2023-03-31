import Lottie from "lottie-react";
import animationData from "@judie/styles/lottie/background-animation.json";
import animationData2 from "@judie/styles/lottie/background-animation-2.json";
import styles from "./HomepageBackground.module.scss";
import dynamic from "next/dynamic";

export enum HomepageStyle {
  Default = "default",
  Blue = "blue",
}

const HomepageBackground = ({ mode }: { mode: HomepageStyle }) => {
  return (
    <div className={styles.homepageBackground}>
      <Lottie
        animationData={
          mode === HomepageStyle.Blue ? animationData2 : animationData
        }
        loop
        style={{
          fill: "#d3d3d3",
        }}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(HomepageBackground), {
  ssr: false,
});
