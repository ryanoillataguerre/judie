import { Html, Head, Main, NextScript } from "next/document";
import * as snippet from "@segment/snippet";
import { isProduction } from "@judie/utils/env";

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
        <script
          dangerouslySetInnerHTML={{ __html: loadSegment() }}
          id="segmentScript"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
