import { NextSeo } from "next-seo";
import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import PAGE from "@/routes";
import { seoConfig } from "@/lib/seoConfig";
import NotFoundPage from "@/components/NotFoundPage";

export default function FourOhFour() {
    const seo = seoConfig(PAGE.Landing);

    return (
        <div className={"max-h-screen overflow-hidden"}>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            <NotFoundPage />
        </div>
    );
}

FourOhFour.getLayout = function (page) {
    return <LayoutFullscreen>{page}</LayoutFullscreen>;
};
