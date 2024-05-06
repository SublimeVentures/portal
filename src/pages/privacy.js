import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import HeroBg from "@/components/Home/HeroBg";
import { PAGE } from "@/lib/enum/route";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
import { tenantIndex } from "@/lib/utils";
const Privacy_based = dynamic(() => import("@/components/Legal/Privacy_based"), { ssr: true });
const Privacy_kongz = dynamic(() => import("@/components/Legal/Privacy_kongz"), { ssr: true });
const Privacy_neotokyo = dynamic(() => import("@/components/Legal/Privacy_neotokyo"), { ssr: true });

const TENANT_PRIAVCY = () => {
    switch (tenantIndex) {
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

const {
    DESCRIPTION,
    INFO: { og, twitter },
    PAGES: {
        [PAGE.Privacy]: { title, url },
    },
} = getTenantConfig(tenantIndex).seo;

export default function Privacy() {
    return (
        <>
            <NextSeo title={title} description={DESCRIPTION} canonical={url} openGraph={og} twitter={twitter} />
            <HeroBg subtitle={""} title={"Privacy Policy"} content={TENANT_PRIAVCY()} extraClass={"listWithStyle"} />
        </>
    );
}
