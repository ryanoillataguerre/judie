import "@judie/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import theme from "@judie/styles/theme";
import { useLocalStorage } from "@mantine/hooks";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  // Color Scheme Provider Setup
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const { isReady } = useRouter();
  if (!isReady) {
    return <LoadingScreen />;
  }
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
            }}
          >
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </>
  );
}
