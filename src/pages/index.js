import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { seoConfig } from "@/lib/seoConfig";
import PAGE from "@/routes";
import { verifyID } from "@/lib/authHelpers";
import { TENANT } from "@/lib/tenantHelper";
import Layout from "@/components/Layout/Layout";

const HomeBased = dynamic(() => import("@/components/Home"), { ssr: true });
const HomeCitCap = dynamic(() => import("@/components/HomeCitCap"), {
    ssr: true,
});
const HomeKongz = dynamic(() => import("@/components/HomeKongzCapital"), {
    ssr: true,
});

const renderLanding = (account) => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return <HomeBased account={account} />;
        }
        case TENANT.NeoTokyo: {
            return <HomeCitCap account={account} />;
        }
        case TENANT.CyberKongz: {
            return <HomeKongz account={account} />;
        }
    }
};

export default function Home({ account }) {
    const seo = seoConfig(PAGE.Landing);
    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />

            {renderLanding(account)}
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

Home.getLayout = function (page) {
    return <Layout>{page}</Layout>;
};
