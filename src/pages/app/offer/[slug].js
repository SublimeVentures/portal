import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import OfferDetailsParams from "@/components/App/Offer/OfferDetailsParams";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDownload from "@/assets/svg/Download.svg";
import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";


export default function AppOfferDetails() {

    const showSingle = false
    const val = 80
    const pages=  [
            null,
            "https://basedvc.s3.amazonaws.com/rr_test/0001.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0002.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0003.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0004.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0005.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0006.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0007.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0008.jpg",
            "https://basedvc.s3.amazonaws.com/rr_test/0009.jpg",
        ]


    return (
        <div className="grid grid-cols-12 gap-y-10 mobile:gap-10">
            <div className="flex flex-row col-span-12 xl:col-span-8 rounded-xl bg">
                {/*<PanelStages/>*/}
            </div>
            <div className="flex flex-col col-span-12 gap-5 sm:gap-10 sinvest:flex-row xl:col-span-4 xl:!flex-col xl:gap-0">
                <OfferDetailsParams/>
            </div>
            <div className="flex flex-col col-span-12 ">
                <OfferDetailsProgress/>
            </div>

            <div className="flex flex-col col-span-12 ">
                <div className="px-10 py-8 rounded-xl bg-navy-accent relative">
                    <div className="text-2xl font-bold">About project</div>
                    <div className="absolute right-10 top-4">
                        <div className="hidden sm:flex">
                        <RoundButton text={'PDF'} isLoading={false} isDisabled={false} is3d={true} isWide={true} isPrimary={false} showParticles={true} zoom={1.1} size={'text-sm sm'} icon={<IconDownload className={ButtonIconSize.hero}/> } />

                    </div>
                    <div className="flex sm:hidden">
                        <RoundButton text={''} isLoading={false} isDisabled={false} is3d={true} isWide={true} isPrimary={false} showParticles={true} zoom={1.1} size={'text-sm icon'} icon={<IconDownload className={ButtonIconSize.small}/> } />
                </div>

            </div>
        </div>
    <div className="sm:pt-10 fliper">
    {/*    <client-only>*/}
    {/*        <Flipbook className="flipbook" :pages="pages" :singlePage="showSingle" :zooms="[1,1.5,2]"></Flipbook>*/}
    {/*</client-only>*/}
</div>

</div>
</div>

    )
}


AppOfferDetails.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
}
;
