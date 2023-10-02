import { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import * as snippet from "@segment/snippet";
import { isProduction } from "@judie/utils/env";
import { ColorModeScript } from "@chakra-ui/react";
import { default as NextDocument } from "next/document";
import emotionCache from "@judie/utils/emotionCache";
import createEmotionServer from "@emotion/server/create-instance";

const { extractCritical } = createEmotionServer(emotionCache);

export default function Document() {
  const loadSegment = () => {
    const options = {
      apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    };
    if (isProduction()) {
      return snippet.max(options);
    } else {
      return snippet.min(options);
    }
  };
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <script
          dangerouslySetInnerHTML={{ __html: loadSegment() }}
          id="segmentScript"
        />
        <script src="https://accounts.google.com/gsi/client" async defer />
      </Head>
      <body>
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export const getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await NextDocument.getInitialProps(ctx);
  const styles = extractCritical(initialProps.html);
  return {
    ...initialProps,
    styles: [
      initialProps.styles,
      <style
        key="emotion-css"
        dangerouslySetInnerHTML={{ __html: styles.css }}
        data-emotion-css={styles.ids.join(" ")}
      />,
    ],
  };
};
