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
        <div className="relative grow lg:overflow-hidden flex flex-col gap-4 lg:mb-6 3xl:mb-12">
            <div>
                <Title count={marketsCount} subtitle="Explore Opportunities Beyond the Exchange">
                    All Markets
                </Title>
            </div>

            {!currentMarket && <h3 className="hidden absolute text-white left-[450px] xl:block">Latest deals</h3>}

            <div className="flex flex-col lg:h-full gap-8 lg:overflow-hidden lg:grid lg:grid-cols-[35%_1fr] 3xl:grid-cols-[420px_1fr] lg:grid-rows-1">
                {children}
            </div>
        </div>
    );
}
