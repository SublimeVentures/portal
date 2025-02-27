import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import HeroBg from "@/components/Home/HeroBg";
import PAGE from "@/routes";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
const TokenomicNeoTokyo = dynamic(() => import("@/components/Tokenomics/TokenomicsCitCap"), { ssr: true });
const TokenomicKongzCapital = dynamic(() => import("@/components/Tokenomics/TokenomicsCyberKongz"), { ssr: true });

const TENANT_TOKENOMICS = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return <TokenomicNeoTokyo />;
        }
        case TENANT.CyberKongz: {
            return <TokenomicKongzCapital />;
        }
        default: {
            return null;
        }
    }
};

const {
    DESCRIPTION,
    INFO: { og, twitter },
    PAGES: {
        [PAGE.Tokenomics]: { title, url },
    },
} = getTenantConfig().seo;

export default function Tokenomics() {
    return (
        <>
            <NextSeo title={title} description={DESCRIPTION} canonical={url} openGraph={og} twitter={twitter} />
            <HeroBg
                subtitle={"our tokenomics"}
                title={"how it works"}
                content={TENANT_TOKENOMICS()}
                extraClass={"investmentsPublic"}
            />
        </>
    );
}
