import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import HeroBg from "@/components/Home/HeroBg";
import { seoConfig } from "@/lib/seoConfig";
import PAGE from "@/routes";
import { TENANT } from "@/lib/tenantHelper";
const Privacy_based = dynamic(() => import("@/components/Legal/Privacy_based"), { ssr: true });
const Privacy_kongz = dynamic(() => import("@/components/Legal/Privacy_kongz"), { ssr: true });
const Privacy_neotokyo = dynamic(() => import("@/components/Legal/Privacy_neotokyo"), { ssr: true });

const TENANT_PRIAVCY = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return <Privacy_neotokyo />;
        }
        case TENANT.CyberKongz: {
            return <Privacy_kongz />;
        }
        default: {
            return <Privacy_based />;
        }
    }
};

export default function Privacy() {
    const seo = seoConfig(PAGE.Privacy);

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            <HeroBg subtitle={""} title={"Privacy Policy"} content={TENANT_PRIAVCY()} extraClass={"listWithStyle"} />
        </>
    );
}
