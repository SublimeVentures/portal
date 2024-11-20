import { NextSeo } from "next-seo";
import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import { PAGE } from "@/lib/enum/route";
import NotFoundPage from "@/components/NotFoundPage";
import { getTenantConfig } from "@/lib/tenantHelper";

const {
    DESCRIPTION,
    INFO: { og, twitter },
    PAGES: {
        [PAGE.NotFound]: { title, url },
    },
} = getTenantConfig().seo;

export default function FourOhFour() {
    return (
        <div className="max-h-screen overflow-hidden">
            <NextSeo title={title} description={DESCRIPTION} canonical={url} openGraph={og} twitter={twitter} />
            <NotFoundPage />
        </div>
    );
}

FourOhFour.getLayout = function (page) {
    return <LayoutFullscreen>{page}</LayoutFullscreen>;
};
