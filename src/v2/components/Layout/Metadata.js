import Head from "next/head";

import { getCopy } from "@/lib/seoConfig";

const sitename = getCopy("NAME");

export default function Metadata({ title }) {
    const pageTitle = title ? `${title} - ${sitename}` : sitename
    // const pageDescription = description || siteMetadata.description

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta property="og:title" key="title" content={pageTitle} />
        </Head>
    )
}
