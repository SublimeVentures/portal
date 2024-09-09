import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

import { seoConfig } from "@/lib/seoConfig";
import PAGE from "@/routes";
import { verifyID } from "@/lib/authHelpers";
import { useTenantSpecificData } from "@/v2/helpers/tenant";

const renderLanding = (componentName, account) => {
    const TenantComponent = dynamic(() => import(`@/components/${componentName}`), { ssr: true });
    return <TenantComponent account={account} />;
};

export default function Home({ account }) {
    const seo = seoConfig(PAGE.Landing);
    const { components } = useTenantSpecificData();

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />

            {renderLanding(components.landing, account)}
        </>
    );
}

export const getServerSideProps = async ({ res }) => {
    const account = await verifyID(res.req);
    return {
        props: {
            account: account?.user ? account.user : null,
        },
    };
};
