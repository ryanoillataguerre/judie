import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors: {
    brand: {
      900: "#202123",
      700: "#2a3448",
      lightGray: "#A3A3A3",
    },
  },
};

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
