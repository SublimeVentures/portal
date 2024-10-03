import Head from "next/head";

import { getCopy } from "@/lib/seoConfig";

const sitename = getCopy("NAME");

export default function Metadata({ title, description }) {
    const pageTitle = title ? `${title} - ${sitename}` : sitename;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta property="og:title" key="title" content={pageTitle} />
            {description && <meta name="description" content={description} />}
        </Head>
    );
}
