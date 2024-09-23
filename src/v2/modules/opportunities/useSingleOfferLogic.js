import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { OfferStatus, OfferDateText, BadgeVariants, getStatus, formatDate } from "./helpers";
import { fetchOfferProgress } from "@/fetchers/offer.fetcher";
import { phases } from "@/lib/phases";
import { cacheOptions } from "@/v2/helpers/query";
import { offersKeys } from "@/v2/constants";

export const useOfferStatus = (offer) => {
    const { phaseCurrent } = phases(offer);
    const state = phaseCurrent?.phaseName;
    const status = getStatus(phaseCurrent);
    const variant = BadgeVariants[status];

    return { state, status, variant };
};

export const offerProgressQueryOptions = (id) => ({
    queryKey: offersKeys.queryOfferProgress(id),
    queryFn: () => fetchOfferProgress(id),
});

export const useOfferProgressQuery = (id, options) => useQuery({ ...offerProgressQueryOptions(id), ...options });

export default function useSingleOfferLogic(offer) {
    const { offerId, name, slug, genre, ticker, d_open: starts, d_close: ends } = offer || {};

    const { state, status, variant } = useOfferStatus(offer);

    const { data, isLoading, isError } = useOfferProgressQuery(offerId, {
        ...cacheOptions,
        refetchOnMount: true,
        enabled: status === OfferStatus.IN_PROGRESS,
    });

    const formatKey = status === OfferStatus.CLOSED ? "LL" : "lll";
    const timestamp = status === OfferStatus.PENDING ? starts : ends;
    const progress = data?.progress ?? 0;

    return {
        isLoading,
        isError,
        getSingleOfferProps: useCallback(
            () => ({
                name,
                slug,
                genre,
                ticker,
                state,
                btnVariant: variant,
                progress: status === OfferStatus.CLOSED ? 100 : progress,
                dateLabel: OfferDateText[status],
                date: formatDate(timestamp, formatKey),
            }),
            [name, slug, genre, ticker, state, status, progress, timestamp, formatKey],
        ),
    };
}
