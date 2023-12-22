import {Html, Head, Main, NextScript} from 'next/document'
import {isBased} from "@/lib/utils";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link rel="icon" href={isBased ? "/favicon.svg" : "/img/favicon.png"} sizes="any" />
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
