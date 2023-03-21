import { RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "./Input.module.scss";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register?: UseFormRegister<any>;
}

const Input = ({ name, className, register, ...props }: CustomInputProps) => {
  return (
    <input
      className={styles.input}
      {...(register ? register(name) : {})}
      {...props}
    />
  );
};

export default Input;
