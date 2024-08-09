import { useEffect } from "react";

import useOTCStore from "../logic/store";
import useMarket from "../logic/useMarket";
import Title from "@/v2/modules/opportunities/Title";

export default function Markets({ children, session }) {
    const setSession = useOTCStore((state) => state.setSession);

    useEffect(() => {
        setSession(session);
    }, [session, setSession]);

    const { marketsCount } = useMarket();

    return (
        <div className="p-4 pt-0 flex flex-col gap-4 md:p-16 md:pt-0 xl:h-[70vh]">
            <div>
                <Title count={marketsCount} subtitle="Explore Opportunities Beyond the Exchange">
                    All Markets
                </Title>
            </div>

            <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[420px_1fr] xl:grid-rows-1 xl:h-[60vh]">
                {children}
            </div>
        </div>
    );
}
