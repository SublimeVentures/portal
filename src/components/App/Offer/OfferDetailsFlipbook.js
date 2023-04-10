import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDownload from "@/assets/svg/Download.svg";
import "@/webComponents/my-flip.js";


export default function OfferDetailsFlipbook({}) {

    return (
        <>
            <div className="px-10 py-8  rounded-xl bg-navy-accent relative">
                <div className="text-xl uppercase font-medium text-app-accent2">About project</div>
                <div className="absolute right-10 top-4">
                    <div className="hidden sm:flex">
                        <RoundButton text={'PDF'} isLoading={false} isDisabled={false} is3d={true} isWide={true}
                                     isPrimary={false} showParticles={true} zoom={1.1} size={'text-sm sm'}
                                     icon={<IconDownload className={ButtonIconSize.hero}/>}/>

                    </div>
                    <div className="flex sm:hidden">
                        <RoundButton text={''} isLoading={false} isDisabled={false} is3d={true} isWide={true}
                                     isPrimary={false} showParticles={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconDownload className={ButtonIconSize.small}/>}/>
                    </div>

                </div>
            </div>
            <div className="my-10">
                <my-flip url="https://basedvc.s3.amazonaws.com/rr_test/" amount="9"></my-flip>

            </div>

        </>


    )
}
