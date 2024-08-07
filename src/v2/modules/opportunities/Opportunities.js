import { useRef } from "react";

import SingleOffer from "./SingleOffer";
import SingleOfferLoader from "./SingleOfferLoader";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import { shortCurrencyFormatterWithSuffix } from "@/v2/lib/currency";
import { useIntersectionObserver } from "@/v2/hooks";
import { Metadata } from "@/v2/components/Layout";
import {
    InvestedStatisticCard,
    PartnersStatisticCard,
    RaisedStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";

export default function Opportunities({ offers, stats, infiniteLoaderOpts }) {
    const { partners = 0, vc: investments = 0, funded: rawFunded = 0 } = stats;
    const { isFetchingNextPage, hasNextPage, fetchNextPage } = infiniteLoaderOpts;

    const ref = useRef();

    useIntersectionObserver(ref, (isIntersecting) => {
        if (isIntersecting && !isFetchingNextPage && hasNextPage) fetchNextPage();
    });

    return (
        <>
            <Metadata title="Opportunities" />
            <div className="flex items-center justify-center">
                <div className="w-full p-4 lg:p-16">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center xl:gap-4">
                        <div className="mb-8">
                            <h3 className="text-nowrap text-2xl text-foreground">Funded Projects</h3>
                            <p className="text-lg text-[#C4C4C4] whitespace-pre-line">
                                We bring new industry giants to our community
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 grow md:flex md:grow-0">
                            <InvestedStatisticCard value={investments} />
                            {tenantIndex === TENANT.basedVC ? <PartnersStatisticCard value={partners} /> : null}
                            <RaisedStatisticCard value={shortCurrencyFormatterWithSuffix(rawFunded)} />
                        </div>
                    </div>

                    <ul className="mt-8 grid grid-cols-cards gap-y-6 gap-x-8">
                        {offers.map((offer, idx) => {  
                            if (idx + 1 === offers.length && hasNextPage) {
                                return (
                                    <li ref={ref} key={offer?.offerId} className="text-red-500">
                                        <SingleOffer offer={offer} />
                                    </li>
                                )
                            }

                            return (
                                <li key={offer?.offerId}>
                                    <SingleOffer offer={offer} />
                                </li>
                            )
                        })}
                    </ul>

                    {isFetchingNextPage && (
                        <ul className="mt-8 grid grid-cols-cards gap-y-6 gap-x-8">
                            {Array.from({ length: 6 }, (_, index) => (
                                <li key={index} className="min-h-[305px] h-full lg:min-h-[355px]">
                                    <SingleOfferLoader />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};
