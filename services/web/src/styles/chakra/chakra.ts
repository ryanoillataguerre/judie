import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      900: "#202123",
      700: "#2a3448",
      primary: "#3C1478",
      secondary: "#6D4B9F",
      lightGray: "#A3A3A3",
    },
  },
});

export default theme;
