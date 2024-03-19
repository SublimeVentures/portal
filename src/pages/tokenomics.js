import HeroBg from "@/components/Home/HeroBg";
import { NextSeo } from "next-seo";
import { seoConfig } from "@/lib/seoConfig";
import PAGE from "@/routes";
import dynamic from "next/dynamic";
import { TENANT } from "@/lib/tenantHelper";
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
            return <></>;
        }
    }
};

export default function InvestmentsPublic() {
    const seo = seoConfig(PAGE.Tokenomics);

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            <HeroBg
                subtitle={"our tokenomics"}
                title={"how it works"}
                content={TENANT_TOKENOMICS()}
                extraClass={"investmentsPublic"}
            />
        </>
    );
}
