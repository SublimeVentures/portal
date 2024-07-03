import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchOfferProgress } from "@/fetchers/offer.fetcher";
import { phases } from "@/lib/phases";
import { cacheOptions } from "@/v2/helpers/query";
import { OfferStatus, OfferDateText, BadgeVariants, getStatus, formatDate } from "./helpers";

export default function useSingleOfferLogic(offer) {
    const { offerId, name, slug, genre, ticker, d_open: starts, d_close: ends } = offer;
    
    const { phaseCurrent } = phases(offer);
    const state = phaseCurrent?.phaseName;
    const status = getStatus(phaseCurrent);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["offerProgress", { offerId }],
        queryFn: () => fetchOfferProgress(offerId),
        ...cacheOptions,
        refetchOnMount: true,
        enabled: status === OfferStatus.IN_PROGRESS,
    });

    const formatKey = status === OfferStatus.CLOSED ? 'LL' : 'lll';
    const timestamp = status === OfferStatus.PENDING ? starts : ends;

    const progress = data?.progress ?? 0;

    return {
        isLoading,
        isError,
        getSingleOfferProps: useCallback(() => ({
            name,
            slug,
            genre,
            ticker,
            state,
            btnVariant: BadgeVariants[status],
            progress: status === OfferStatus.CLOSED ? 100 : progress,
            dateLabel: OfferDateText[status],
            date: formatDate(timestamp, formatKey),
        }), [name, slug, genre, ticker, state, status, progress, timestamp, formatKey])
    };
};
