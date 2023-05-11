import {useEffect} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconLight from "@/assets/svg/Light.svg";
import PAGE from "@/routes";
import Link from "next/link";

export default function EmptyVault() {
    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);

    return (
        <div className="max-h-[500px] text-center -mt-10">
            <lottie-player
                autoplay
                loop
                style={{width:'100%', height:'100%', maxHeight: '500px', maxWidth:'500px', margin: '0 auto'}}
                mode="normal"
                src="/static/lottie/vault.json"
            />
            <div className="text-2xl -mt-5 sm:-mt-10 uppercase text-hero font-medium !text-3xl tracking-wider ">
                <Link href={PAGE.Opportunities}>
                    <RoundButton text={'Invest to unlock'} is3d={true} isPrimary={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconLight className={ButtonIconSize.hero}/>}/>
                </Link>
            </div>
        </div>


    )
}
