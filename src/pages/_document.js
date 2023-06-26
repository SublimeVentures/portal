import {Html, Head, Main, NextScript} from 'next/document'
import Gtag from "@/components/gtag";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="stylesheet" href={`/browser/index-5d6202c2.css`}/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            </Head>
            <body>
            <Gtag/>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
