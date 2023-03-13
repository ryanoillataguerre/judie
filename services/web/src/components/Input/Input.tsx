import styles from "./Input.module.scss";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, className, ...props }: CustomInputProps) => {
  return (
    // <div
    //   className={
    //     className ? `${className} ${styles.inputWrapper}` : styles.inputWrapper
    //   }
    // >
    // {label ? <label>{label}</label> : undefined}
    <input className={styles.input} {...props} />
    // </div>
  );
};

export default Input;
