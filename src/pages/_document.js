import { Html, Head, Main, NextScript } from "next/document";
import { TENANT } from "@/lib/tenantHelper";
import InitPage from "@/components/InitPage/InitPage";

const TENANT_FAVICON = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return "/favicon.svg";
        }
        case TENANT.NeoTokyo: {
            return "/img/favicon.png";
        }
        case TENANT.CyberKongz: {
            return "/favicon_14.png";
        }
        case TENANT.BAYC: {
            return "/favicon_19.png";
        }
    }
};

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link rel="icon" href={TENANT_FAVICON()} sizes="any" />
            </Head>
            <body style={{ display: "block" }}>
                <InitPage />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
