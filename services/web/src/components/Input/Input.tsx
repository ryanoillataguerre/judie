import { RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "./Input.module.scss";
import { ErrorMessage } from "@hookform/error-message";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  errors?: any;
  register?: UseFormRegister<any>;
}

const Input = ({
  name,
  className,
  errors,
  register,
  ...props
}: CustomInputProps) => {
  return (
    <>
      <input
        className={styles.input}
        {...(register ? register(name) : {})}
        {...props}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className={styles.errorText}>{message}</p>}
      />
    </>
  );
};

export default Input;
