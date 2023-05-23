import {
  Spinner,
  ButtonProps as BaseButtonProps,
  Button as BaseButton,
} from "@chakra-ui/react";

interface ButtonProps extends BaseButtonProps {
  label?: string | JSX.Element;
  loading?: boolean;
}
const Button = ({ label, loading, ...props }: ButtonProps) => {
  return <BaseButton {...props}>{loading ? <Spinner /> : label}</BaseButton>;
};

export default Button;
