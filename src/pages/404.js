import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import IconDashboard from "@/assets/svg/Home.svg";
import Link from "next/link";
import PAGE from "@/routes";
import { NextSeo } from "next-seo";
import { seoConfig } from "@/lib/seoConfig";
import Lottie from "lottie-react";
import lottie404 from "@/assets/lottie/404v3.json";

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
            <Lottie
                animationData={lottie404}
                loop={true}
                autoplay={true}
                style={{ width: "100%", margin: "5px auto" }}
            />
            ;
            <Link
                href={PAGE.Landing}
                className="absolute top-10 left-0 right-0"
            >
                <RoundButton
                    text={"HOME"}
                    is3d={true}
                    isPrimary={false}
                    isWide={true}
                    zoom={1.1}
                    size={"text-sm sm"}
                    icon={<IconDashboard className={ButtonIconSize.hero} />}
                />
            </Link>
        </div>
    );
}

FourOhFour.getLayout = function (page) {
    return <LayoutFullscreen>{page}</LayoutFullscreen>;
};
