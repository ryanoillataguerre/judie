import "@judie/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${openSans.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
