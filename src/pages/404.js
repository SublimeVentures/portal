import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import {useEffect} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDashboard from "@/assets/svg/Home.svg";
import Link from "next/link";
import PAGE from "@/routes";
import {NextSeo} from "next-seo";

export default function FourOhFour() {

    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);


    return <>
        <NextSeo
            title="404 - 3VC"
            description="DON'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES."
            canonical="https://www.3vc.fund/"
            openGraph={{
                type: 'website',
                url: 'https://www.3vc.fund/',
                title: '3VC - login',
                description: 'DON\'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES.',
                images: [
                    {
                        url: 'https://www.example.ie/og-image-01.jpg',
                        width: 800,
                        height: 600,
                        alt: 'Og Image Alt',
                        type: 'image/jpeg',
                    },
                    {
                        url: 'https://www.example.ie/og-image-02.jpg',
                        width: 800,
                        height: 600,
                        alt: 'Og Image Alt2',
                        type: 'image/jpeg',
                    },
                ],
                siteName: '3VC',
            }}
            twitter={{
                handle: '@3VCfund',
                site: '@3VCfund',
                cardType: 'summary_large_image',
            }}
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
