import "@judie/styles/globals.scss";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import Head from "next/head";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import { useEffect } from "react";
import theme from "@judie/styles/chakra/chakra";
import { isProduction } from "@judie/utils/env";
import SidebarOpenCloseProvider from "@judie/context/sidebarOpenCloseProvider";
import * as gtag from "@judie/utils/gtag";
import Script from "next/script";

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

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Global navigate to waitlist
  // useEffect(() => {
  //   router.push("/waitlist");
  // }, [router.asPath]);

  if (!router.isReady) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      {/* !-- Upfluence Tracking Script -- */}
      <Script
        strategy="afterInteractive"
        src={`https://tracking.upfluence.co/js/v1/init-${process.env.NEXT_PUBLIC_UPFLUENCE_SCRIPT_ID}.js`}
      />
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <SidebarOpenCloseProvider>
            <Component {...pageProps} />
          </SidebarOpenCloseProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}
