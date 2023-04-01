import { UseFormRegister } from "react-hook-form";
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
  label?: string | JSX.Element;
}

const Input = ({
  name,
  className,
  errors,
  register,
  required,
  label,
  ...props
}: CustomInputProps) => {
  return (
    <>
      {label && (
        <h4
          className={
            required ? [styles.label, styles.required].join(" ") : styles.label
          }
        >
          {label}
        </h4>
      )}
      <input
        className={styles.input}
        required
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
