import { useEffect } from "react";

import useOTCStore from "../logic/store";
import useMarket from "../logic/useMarket";
import Title from "@/v2/modules/opportunities/Title";

export default function Markets({ children, session }) {
    const setSession = useOTCStore((state) => state.setSession);

    useEffect(() => {
        setSession(session);
    }, [session, setSession]);

    const { currentMarket, marketsCount } = useMarket();

    return (
        <div className="relative flex flex-col gap-4 h-full xl:h-[calc(100vh_-_var(--headerHeight)_-160px)]">
            <div>
                <Title count={marketsCount} subtitle="Explore Opportunities Beyond the Exchange">
                    All Markets
                </Title>
            </div>

            {!currentMarket && <h3 className="hidden absolute text-white left-[450px] xl:block">Latest deals</h3>}

            <div className="flex flex-col h-full gap-8 overflow-hidden xl:grid xl:grid-cols-[420px_1fr] xl:grid-rows-1">
                {children}
            </div>
        </div>
    );
}
