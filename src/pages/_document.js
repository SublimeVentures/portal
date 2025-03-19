import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.png" type="image/png" />
            </Head>
            <body>
                <Main />
                <div id="portal-root" />
                <NextScript />
            </body>
        </Html>
    );
}
