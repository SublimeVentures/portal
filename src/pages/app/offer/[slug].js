import LayoutApp from '@/components/Layout/LayoutApp';
import OfferDetailsParams from "@/components/App/Offer/OfferDetailsParams";
import OfferDetailsInvest from "@/components/App/Offer/OfferDetailsInvest";
import dynamic from "next/dynamic";
const OfferDetailsFlipbook = dynamic(() => import('@/components/App/Offer/OfferDetailsFlipbook'), {ssr: false,})


export default function AppOfferDetails() {


    return (
        <div className="grid grid-cols-12 gap-y-10 mobile:gap-10">
            <div className="flex flex-row col-span-12 xl:col-span-8 rounded-xl bg">
                <OfferDetailsInvest/>
            </div>
            <div
                className="flex flex-col col-span-12 gap-5 sm:gap-10 sinvest:flex-row xl:col-span-4 xl:!flex-col xl:gap-0">
                <OfferDetailsParams/>
            </div>
            <div className="flex flex-col col-span-12 ">
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
