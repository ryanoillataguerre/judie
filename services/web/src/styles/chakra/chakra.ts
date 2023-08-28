import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-sans/800.css";
import "@fontsource/dm-sans/900.css";

import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const textComponentStyle: ComponentStyleConfig = {
  baseStyle: {
    fontSize: "1rem",
    fontWeight: 500,
  },
  variants: {
    header: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    subheader: (props: StyleFunctionProps) => ({
      color: "gray.500",
      fontWeight: 500,
      fontSize: "1.375rem",
    }),
    headerDetail: (props: StyleFunctionProps) => ({
      color: "gray.500",
      fontWeight: 500,
      fontSize: "1.125rem",
    }),
    title: {
      fontWeight: 500,
      fontSize: "1.125rem",
    },
    detail: {
      color: "gray.500",
      fontWeight: 400,
      fontSize: "0.875rem",
    },
  },
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
    secondary: (props: StyleFunctionProps) => ({
      bg: "transparent",
      borderColor: props.colorMode === "dark" ? "#D3D3D3" : "#676767",
      borderWidth: "1px",
      padding: "0.5rem 1rem",
      _hover: {
        bg: props.colorMode === "dark" ? "#676767" : "#D3D3D3",
      },
      _active: {
        bg: props.colorMode === "dark" ? "#D3D3D3" : "gray.700",
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
  fonts: {
    heading: `'DM Sans', sans-serif`,
    body: `'DM Sans', sans-serif`,
  },
  colors: {
    brand: {
      900: "#202123",
      700: "#2a3448",
      backgroundLight: "#F6F6F6",
      backgroundDark: "#252525",
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
  components: {
    Button: buttonComponentStyle,
    Text: textComponentStyle,
  },
});

export default theme;
