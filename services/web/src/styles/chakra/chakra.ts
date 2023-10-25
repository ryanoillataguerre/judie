import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-sans/800.css";
import "@fontsource/dm-sans/900.css";

import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";
import { defineStyleConfig } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";

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
    headerLight: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    subheader: {
      fontWeight: 500,
      fontSize: "1.375rem",
    },
    boldSubheader: {
      fontWeight: 700,
      fontSize: "1.25rem",
    },
    subheaderDetail: {
      color: "gray.500",
      fontWeight: 500,
      fontSize: "1.375rem",
    },
    headerDetail: {
      color: "gray.500",
      fontWeight: 500,
      fontSize: "1.125rem",
    },
    title: {
      fontWeight: 500,
      fontSize: "1.125rem",
    },
    detail: {
      color: "gray.500",
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    base: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    tinyTitle: {
      fontWeight: 500,
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
    md: (props: StyleFunctionProps) => ({
      height: "3rem",
      borderRadius: "1.5rem",
    }),
    squareSm: {
      height: "2rem",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      fontSize: "1.125rem",
      fontWeight: 500,
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
    Text: textComponentStyle,
    MultiSelect: MultiSelectTheme,
  },
  config,
  fonts: {
    heading: `'DM Sans', sans-serif`,
    body: `'DM Sans', sans-serif`,
  },
  colors: {
    brand: {
      900: "#202123",
      700: "#2a3448",
      primary: "#3C1478",
      secondary: "#6D4B9F",
      lightGray: "#A3A3A3",
      lightGray2: "#E2E8F0",
      lightPrimary: "#C31478",
      backgroundLight: "#F6F6F6",
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
        bg: mode("#F6F6F6", "gray.800")(props),
      },
    }),
  },
});

export const uploadThemeOverride = {
  colors: {
    textColor: "#fff",
    subtitleColor: "#fff",
    inactiveColor: "#5D55FA",
    border: "#5D55FA",
    background: "#2D3748",
    backgroundAlpha: "rgba(255,255,255,0)",
    secondaryBackground: "#1A202C",
    highlight: "#5D55FA",
    rsi: {
      // your brand colors should go here
      50: "#6D4B9F",
      100: "#5D55FA",
      200: "#5D55FA",
      300: "#5D55FA",
      400: "#5D55FA",
      500: "#5D55FA",
      600: "#5D55FA",
      700: "#5D55FA",
      800: "#5D55FA",
      900: "#5D55FA",
    },
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: "10px",
        backgroundColor: "#5D55FA",
        textColor: "#fff",
      },
      defaultProps: {
        colorScheme: "",
      },
    },

    MatchColumnsStep: {
      baseStyle: {
        select: {
          control: (provided: any) => ({
            ...provided,
            borderColor: "border",
            _hover: {
              borderColor: "border",
            },
            ["&[data-focus-visible]"]: {
              borderColor: "border",
              boxShadow: "none",
            },
          }),
          option: (provided: any, state: any) => ({
            ...provided,
            color: "textColor",
            bg:
              state.isSelected || state.isFocused ? "highlight" : "background",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            whiteSpace: "nowrap",
            _hover: {
              bg: "highlight",
            },
          }),
        },
      },
    },
  },
  styles: {
    global: {
      ".rdg": {
        contain: "size layout style paint",
        borderRadius: "lg",
        border: "none",
        borderTop: "1px solid var(--rdg-border-color)",
        blockSize: "100%",

        // we have to use vars here because chakra does not autotransform unknown props
        "--rdg-row-height": "35px",
        "--rdg-color": "var(--chakra-colors-textColor)",
        "--rdg-background-color": "var(--chakra-colors-background)",
        "--rdg-header-background-color": "var(--chakra-colors-background)",
        "--rdg-row-hover-background-color": "var(--chakra-colors-background)",
        "--rdg-selection-color": "var(--chakra-colors-blue-400)",
        "--rdg-row-selected-background-color": "var(--chakra-colors-rsi-50)",
        "--row-selected-hover-background-color": "var(--chakra-colors-rsi-100)",
      },
    },
  },
};
export default theme;
