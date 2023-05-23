import "@judie/styles/globals.scss";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import { useEffect } from "react";
import theme from "@judie/styles/chakra/chakra";
import { isProduction } from "@judie/utils/env";

const openSans = Open_Sans({
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (Component.displayName) {
      if (isProduction()) {
        window?.analytics?.page(Component.displayName);
      }
    }
  }, [Component.displayName]);

  if (!router.isReady) {
    return <LoadingScreen />;
  }
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}
