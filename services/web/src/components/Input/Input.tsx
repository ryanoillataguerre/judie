import { RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "./Input.module.scss";
import dynamic from "next/dynamic";

const ErrorMessage = dynamic(
  () => import("@hookform/error-message").then((res) => res.ErrorMessage),
  {
    ssr: false,
  }
);

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
      {errors && errors[name] && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className={styles.errorText}>{message}</p>
          )}
        />
      )}
    </>
  );
};

export default Input;
