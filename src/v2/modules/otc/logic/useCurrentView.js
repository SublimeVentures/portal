import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { queryClient } from "@/lib/queryCache";
import { routes } from '@/v2/routes';
import { otcViews } from "./constants";

export default function useCurrentView() {
    const router = useRouter();
    const { view } = router.query;
    const currentView = otcViews[view?.toUpperCase()] || otcViews.OFFERS;

    useEffect(() => {
        if (!view || !otcViews[view?.toUpperCase()]) {
            if (router.pathname !== routes.OTC) {
                router.replace(routes.OTC, undefined, { shallow: true });
            }
        }
    }, [view, router]);

    useEffect(() => {
        if (currentView === otcViews.OFFERS) {
            queryClient.invalidateQueries(["otcOffers"]);
        }
    }, [currentView]);

    const handleChangeView = (view) => router.push({
        pathname: router.pathname,
        query: { ...router.query, view } },
        undefined,
        { shallow: true },
    );

    return {
        views: Object.values(otcViews),
        activeView: currentView,
        handleChangeView, 
    };
};
