import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const buttonComponentStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {
    md: {
      height: "3rem",
      borderRadius: "1.5rem",
    },
  },
  // styles for different visual variants ("outline", "solid")
  variants: {
    purp: (props: StyleFunctionProps) => ({
      bg: props.colorMode === "dark" ? "purple.300" : "purple.700",
      padding: "0.5rem 1rem",
      textColor: "white",
      _hover: {
        bg: props.colorMode === "dark" ? "purple.400" : "purple.600",
      },
      _active: {
        bg: props.colorMode === "dark" ? "purple.600" : "purple.800",
      },
    }),
  },
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {
    // size: '',
    // variant: '',
    // colorScheme: '',
  },
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      900: "#202123",
      700: "#2a3448",
    },
    purple: {
      "50": "#F0E9FB",
      "100": "#D6C2F5",
      "200": "#BC9AEE",
      "300": "#A273E8",
      "400": "#884CE1",
      "500": "#6D24DB",
      "600": "#571DAF",
      "700": "#421683",
      "800": "#2C0F57",
      "900": "#16072C",
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("#F6F6F6", "#252525")(props),
      },
    }),
  },
  components: {
    Button: buttonComponentStyle,
  },
});

export default theme;
