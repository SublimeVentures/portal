import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import HeroBg from "@/components/Home/HeroBg";
import { seoConfig } from "@/lib/seoConfig";
import PAGE from "@/routes";
import { TENANT } from "@/lib/tenantHelper";
const ToS_based = dynamic(() => import("@/components/Legal/ToS_based"), {
    ssr: true,
});
const ToS_kongz = dynamic(() => import("@/components/Legal/ToS_kongz"), {
    ssr: true,
});
const ToS_neotokyo = dynamic(() => import("@/components/Legal/ToS_neotokyo"), {
    ssr: true,
});

const TENANT_TOS = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return <ToS_neotokyo />;
        }
        case TENANT.CyberKongz: {
            return <ToS_kongz />;
        }
        default: {
            return <ToS_based />;
        }
    }
};

export default function Terms() {
    const seo = seoConfig(PAGE.ToS);

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            <HeroBg subtitle={""} title={"Terms of Service"} content={TENANT_TOS()} extraClass={"listWithStyle"} />
        </>
    );
}
