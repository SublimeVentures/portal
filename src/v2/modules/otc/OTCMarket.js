import { useState } from "react";

import { Metadata } from "@/v2/components/Layout";
import MakeOfferModal from "@/v2/modules/otc/components/MakeOfferModal";
import { OtcMarkets, OtcCurrentMarket, OtcOffers } from "./components";

export default function OTCMarket({ session, otc, propOffers, currentMarket }) {
    const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);

    return (
        <>
            <Metadata title={`${currentMarket.name} Market`} />
            <div className="p-4 md:p-16 md:h-[calc(100vh_-_100px)]">
                <div className="mb-8">
                    <h3 className="text-nowrap text-2xl text-foreground">All markets</h3>
                    <p className="text-lg text-[#C4C4C4] whitespace-pre-line">
                        Explore Opportunities Beyond the Exchange
                    </p>
                </div>

                <div className="h-full flex flex-col gap-8 2xl:flex-row">
                    <OtcMarkets otc={otc} currentMarket={currentMarket} />
                        
                    <div className="h-full w-full flex flex-col">
                        <OtcCurrentMarket currentMarket={currentMarket} />
                        <OtcOffers session={session} currentMarket={currentMarket} setIsMakeModalOpen={setIsMakeModalOpen} propOffers={propOffers} />
                    </div>
                </div>
            </div>

            <MakeOfferModal isModalOpen={isMakeModalOpen} setIsModalOpen={setIsMakeModalOpen} props={propOffers} />
        </>
    );
};
