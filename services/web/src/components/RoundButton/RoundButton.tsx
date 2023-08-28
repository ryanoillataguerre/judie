import React from "react";
import {
  Button,
  Spinner,
  ButtonProps as BaseButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

interface RoundButtonProps extends BaseButtonProps {
  text: string;
  loading?: boolean;
  onClick?: () => void;
}

const RoundButton = ({ text, loading, ...props }: RoundButtonProps) => {
  const bg = useColorModeValue("brand.primary", "white");
  const color = useColorModeValue("white", "brand.primary");
  const hoverBg = useColorModeValue(
    { bg: "brand.secondary" },
    { bg: "brand.lightGray2" }
  );

  return (
    <Button
      borderRadius={"100px"}
      py={15}
      px={30}
      alignSelf={"center"}
      h={"auto"}
      bg={bg}
      color={color}
      _hover={hoverBg}
      {...props}
    >
      {loading ? <Spinner /> : text}
    </Button>
  );
};

export default RoundButton;
