import { useMemo } from "react";
import styles from "./Button.module.scss";
import { Spinner } from "@chakra-ui/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string | JSX.Element;
  loading?: boolean;
  variant: ButtonVariant;
}

export enum ButtonVariant {
  Default = "default",
  Blue = "blue",
}
const Button = ({ label, loading, className, variant }: ButtonProps) => {
  const calculatedClass = useMemo(() => {
    if (variant === ButtonVariant.Blue) {
      return [styles.button, styles.blue, className].join(" ");
    }
    return [styles.button, className].join(" ");
  }, [className, variant]);
  return (
    <button className={calculatedClass}>{loading ? <Spinner /> : label}</button>
  );
};

export default Button;
