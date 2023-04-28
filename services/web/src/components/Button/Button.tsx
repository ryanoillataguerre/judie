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
  Transparent = "transparent",
  Red = "red",
  RedTransparent = "red-transparent",
}
const Button = ({
  label,
  loading,
  className,
  variant,
  ...props
}: ButtonProps) => {
  const calculatedClass = useMemo(() => {
    if (variant === ButtonVariant.Blue) {
      return [styles.button, styles.blue, className].join(" ");
    }
    if (variant === ButtonVariant.Transparent) {
      return [styles.button, styles.transparent, className].join(" ");
    }
    if (variant === ButtonVariant.Red) {
      return [styles.button, styles.red, className].join(" ");
    }
    if (variant === ButtonVariant.RedTransparent) {
      return [styles.button, styles.red, styles.transparent, className].join(
        " "
      );
    }
    return [styles.button, className].join(" ");
  }, [className, variant]);
  return (
    <button {...props} className={calculatedClass}>
      {loading ? <Spinner /> : label}
    </button>
  );
};

export default Button;
