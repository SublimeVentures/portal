import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { Metadata } from "@/v2/components/Layout";
import MakeOfferModal from "@/v2/modules/otc/components/MakeOfferModal";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { OtcMarkets, MarketList, OtcCurrentMarket, OtcCurrentMarketMobile, OtcOffers, OtcOffersMobile } from "./components";
import { Search } from "@/v2/components/Fields";

export default function OTCMarket({ session, otc, propOffers, currentMarket }) {
    const { asPath } = useRouter();
    const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);
    const isDesktop = useMediaQuery(breakpoints.md);

    const [showMarkets, setShowMarkets] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const filteredMarkets = useMemo(() => otc.filter(offer => offer.name.toLowerCase().includes(searchValue.toLowerCase())), [otc, searchValue]);
    
    const handleSearchChange = useCallback((evt) => setSearchValue(evt.target.value), []);
    
    const handleSearch = () => {
        if (!isDesktop) setShowMarkets(false);
    }

    return (
        <>
            <Metadata title={`${currentMarket.name} Market`} />
            <div className="p-4 md:p-16 md:h-[calc(100vh_-_100px)]">
                <div className="mb-8">
                    <h3 className="text-nowrap text-2xl text-foreground">{isDesktop ? "All markets" : "OTC Market"}</h3>
                    <p className="text-lg text-[#C4C4C4] whitespace-pre-line">
                        Explore Opportunities Beyond the Exchange
                    </p>
                </div>

                {isDesktop ? (
                    <div className="h-full flex flex-col gap-8 2xl:flex-row">
                        <OtcMarkets
                            markets={filteredMarkets}
                            currentMarket={currentMarket}
                            searchValue={searchValue}
                            handleSearch={handleSearch}
                            handleSearchChange={handleSearchChange}
                        />
                                        
                        <div className="h-full w-full flex flex-col">
                            <OtcCurrentMarket currentMarket={currentMarket} />
                            <OtcOffers session={session} currentMarket={currentMarket} setIsMakeModalOpen={setIsMakeModalOpen} propOffers={propOffers} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <Search
                            name="Search name"
                            className="mb-4"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onClick={() => setShowMarkets(true)}
                            handleSearch={handleSearch}
                        />
                        
                        <div>
                            {showMarkets ? (
                                <MarketList markets={filteredMarkets} selectedMarket={currentMarket} className="h-full" />
                            ) : (
                                <>
                                    <OtcCurrentMarketMobile currentMarket={currentMarket} />
                                    <OtcOffersMobile session={session} currentMarket={currentMarket} setIsMakeModalOpen={setIsMakeModalOpen} propOffers={propOffers} />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <MakeOfferModal isModalOpen={isMakeModalOpen} setIsModalOpen={setIsMakeModalOpen} props={propOffers} />
        </>
    );
};
