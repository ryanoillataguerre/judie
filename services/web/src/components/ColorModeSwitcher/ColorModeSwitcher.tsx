import { Box, Switch, useColorMode } from "@chakra-ui/react";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";

const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BsFillMoonStarsFill
        style={{
          margin: "0 0.5rem 0 0",
        }}
      />
      <Switch
        colorScheme={"yellow"}
        isChecked={colorMode === "light"}
        onChange={() => toggleColorMode()}
      />
      <BsFillSunFill
        style={{
          margin: "0 0 0 0.5rem",
        }}
      />
    </Box>
  );
};

export default ColorModeSwitcher;
