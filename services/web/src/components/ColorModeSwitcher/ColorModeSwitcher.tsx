import { Button, Box, Switch, useColorMode } from "@chakra-ui/react";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";

const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      variant="ghost"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        e.preventDefault();
        toggleColorMode();
      }}
    >
      <BsFillMoonStarsFill
        style={{
          margin: "0 0.5rem 0 0",
        }}
      />
      <Switch colorScheme={"yellow"} isChecked={colorMode === "light"} />
      <BsFillSunFill
        style={{
          margin: "0 0 0 0.5rem",
        }}
      />
    </Button>
  );
};

export default ColorModeSwitcher;
