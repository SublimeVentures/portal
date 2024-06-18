import { useEffect } from "react";
import { useRouter } from "next/router";

import routes from "@/routes";
import { otcViews } from "../utils/constants";

export default function useCurrentView() {
    const router = useRouter();
    const { view } = router.query;
    const currentView = otcViews[view] || otcViews.offers;

    useEffect(() => {
        if (!view || !otcViews[view]) {
            if (router.pathname !== routes.OTC) {
                router.replace(routes.OTC, undefined, { shallow: true });
            }
        }
    }, []);

    const handleChangeView = (view) => router.push({
        pathname: router.pathname,
        query: { ...router.query, view } },
        undefined,
        { shallow: true },
    );

    return {
        views: [otcViews.offers, otcViews.history],
        activeView: currentView,
        handleChangeView, 
    };
};

export { otcViews };
