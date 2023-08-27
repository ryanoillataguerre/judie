import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";
import { defineStyleConfig } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const buttonComponentStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {
    sm: {
      height: "2rem",
      borderRadius: "1rem",
    },
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
const formLabelStyle = defineStyleConfig({
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
    FormLabel: formLabelStyle,
    Button: buttonComponentStyle,
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
      lightPrimary: "#C31478",
    },
    // Customized at https://themera.vercel.app/
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
});

export default theme;
