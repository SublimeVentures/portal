import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import OfferDetailsParams from "@/components/App/Offer/OfferDetailsParams";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDownload from "@/assets/svg/Download.svg";
import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";
import dynamic from "next/dynamic";
const OfferDetailsFlipbook = dynamic(() => import('@/components/App/Offer/OfferDetailsFlipbook'), {ssr: false,})
// import OfferDetailsFlipbook from '@/components/App/Offer/OfferDetailsFlipbook'


export default function AppOfferDetails() {

    const showSingle = false
    const val = 80
    const pages = [
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
            <div
                className="flex flex-col col-span-12 gap-5 sm:gap-10 sinvest:flex-row xl:col-span-4 xl:!flex-col xl:gap-0">
                <OfferDetailsParams/>
            </div>
            <div className="flex flex-col col-span-12 ">
                <OfferDetailsProgress/>
            </div>

            <div className="flex flex-col col-span-12 ">

                <OfferDetailsFlipbook/>

            </div>
        </div>

    )
}


AppOfferDetails.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
}
;
