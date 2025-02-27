import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { PAGE } from "@/lib/enum/route";
import { verifyID } from "@/lib/authHelpers";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";

const HomeBased = dynamic(() => import("@/components/Home"), { ssr: true });
const HomeCitCap = dynamic(() => import("@/components/HomeCitCap"), {
    ssr: true,
});
const HomeKongz = dynamic(() => import("@/components/HomeKongzCapital"), {
    ssr: true,
});

const HomeApes = dynamic(() => import("@/components/HomeApesCapital"), {
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
        case TENANT.BAYC: {
            return <HomeApes account={account} />;
        }
    }
};

const {
    DESCRIPTION,
    INFO: { og, twitter },
    PAGES: {
        [PAGE.Landing]: { title, url },
    },
} = getTenantConfig().seo;

export default function Home({ account }) {
    return (
        <>
            <NextSeo title={title} description={DESCRIPTION} canonical={url} openGraph={og} twitter={twitter} />
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
