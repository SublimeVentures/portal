import { Html, Head, Main, NextScript } from "next/document";
import { getTenantConfig } from "@/lib/tenantHelper";

const { favicon } = getTenantConfig();

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link rel="icon" href={favicon} sizes="any" />
            </Head>
            <body>
                <Main />
                <div id="portal-root" />
                <NextScript />
            </body>
        </Html>
    );
}
