import { Html, Head, Main, NextScript } from 'next/document'
import Gtag from "@/components/gtag";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <link rel="stylesheet" href={`/browser/index-920ff239.css`} />
      </Head>
      <body>
        <Gtag/>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
