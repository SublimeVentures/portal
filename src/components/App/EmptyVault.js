import {useEffect} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconLight from "@/assets/svg/Light.svg";
import PAGE from "@/routes";
import Link from "next/link";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import Image from "next/image";

export default function EmptyVault() {


    return (
        <>
            <lottie-player
                autoplay
                loop
                style={{width:'100%', height:'100%', maxHeight: '400px', maxWidth:'400px', margin: '0 auto', marginTop:'-50px'}}
                mode="normal"
                src="/static/lottie/vault.json"
            />
            <div className="text-2xl -mt-5 sm:-mt-10 uppercase text-hero font-medium !text-3xl tracking-wider ">
                <Link href={PAGE.Opportunities} className={"flex justify-center"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={'Invest to unlock'}
                        isWide={true}
                        is3d={true}
                        isPrimary={false}
                        zoom={1.1}
                        size={'text-sm sm'}
                        icon={<IconLight className={ButtonIconSize.hero}/>}
                    />
                </Link>
            </div>
        </>


    )
}
