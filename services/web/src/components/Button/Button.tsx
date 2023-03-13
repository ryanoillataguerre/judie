import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}
const Button = ({ label, className }: ButtonProps) => {
  return (
    <button className={[styles.button, className].join(" ")}>{label}</button>
  );
};

export default Button;
