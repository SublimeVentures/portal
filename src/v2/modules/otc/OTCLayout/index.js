import { useEffect } from "react";

import useOTCStore from "../logic/store";
import useMarket from "../logic/useMarket";

export default function Markets({ children, session }) {
    const setSession = useOTCStore(state => state.setSession);
    
    useEffect(() => {
        setSession(session);
    }, [session, setSession]);

    const { currentMarket, marketsCount } = useMarket();

    return (
        <div className="relative flex flex-col gap-4 h-full xl:h-[calc(100vh_-_var(--headerHeight)_-160px)]">
            <div>
                <h3 data-market-count={marketsCount || null} className="relative text-[18px] text-foreground text-nowrap after:content-[attr(data-market-count)] after:absolute after:top-0 after:ml-1.5 after:text-[14px]">
                    OTC Market
                </h3>
                <p className="text-[16px] text-[#C4C4C4] whitespace-pre-line">
                    Explore Opportunities Beyond the Exchange
                </p>
            </div>

            {!currentMarket && <h3 className="hidden absolute text-white left-[450px] xl:block">Latest deals</h3>}

            <div className="flex flex-col h-full gap-8 overflow-hidden xl:grid xl:grid-cols-[420px_1fr] xl:grid-rows-1">
                {children}
            </div>
        </div>
    );
};
