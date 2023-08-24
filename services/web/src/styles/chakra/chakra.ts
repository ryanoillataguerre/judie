import { extendTheme } from "@chakra-ui/react";
import { defineStyleConfig } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const FormLabel = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    mb: "10px",
    fontSize: "14px",
  },
  // Two sizes: sm and md
  sizes: {},
  // Two variants: outline and solid
  variants: {},
  // The default size and variant values
  defaultProps: {},
});

const theme = extendTheme({
  components: {
    FormLabel,
  },
  config,
  colors: {
    brand: {
      900: "#202123",
      700: "#2a3448",
      primary: "#3C1478",
      secondary: "#6D4B9F",
      lightGray: "#A3A3A3",
      lightGray2: "#E2E8F0",
    },
  },
});

export default theme;
