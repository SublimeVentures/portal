import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import {useEffect} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDashboard from "@/assets/svg/Home.svg";
import Link from "next/link";
import PAGE from "@/routes";
import {NextSeo} from "next-seo";
import {seoConfig} from "@/lib/seoConfig";

export default function FourOhFour() {
    const seo = seoConfig(PAGE.Landing)

    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);


    return <>
        <NextSeo
            title={seo.title}
            description={seo.description}
            canonical={seo.url}
            openGraph={seo.og}
            twitter={seo.twitter}
        />
        <lottie-player
            autoplay
            loop
            style={{width:'100%', margin:'30px auto'}}
            mode="normal"
            src="/static/lottie/404v3.json"
        />

        <Link href={PAGE.Landing} className="absolute bottom-10">
            <RoundButton text={'Go back'} is3d={true} isPrimary={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconDashboard className={ButtonIconSize.hero}/>}/>
        </Link>
    </>
}

FourOhFour.getLayout = function (page) {
    return <LayoutFullscreen>{page}</LayoutFullscreen>;
};
