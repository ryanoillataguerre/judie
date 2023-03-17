import { useMemo } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant: ButtonVariant;
}

export enum ButtonVariant {
  Default = "default",
  Blue = "blue",
}
const Button = ({ label, className, variant }: ButtonProps) => {
  const calculatedClass = useMemo(() => {
    if (variant === ButtonVariant.Blue) {
      return [styles.button, styles.blue, className].join(" ");
    }
    return [styles.button, className].join(" ");
  }, [className, variant]);
  return <button className={calculatedClass}>{label}</button>;
};

export default Button;
