import { useEffect } from "react";

import useOTCStore from "../logic/store";

export default function Markets({ children, session }) {
    const setSession = useOTCStore(state => state.setSession);
    
    useEffect(() => {
        setSession(session);
    }, [session, setSession]);

    return (
        <div className="p-4 pt-0 flex flex-col gap-4 md:p-16 md:pt-0 xl:h-[70vh]">
            <div>
                <h3 className="text-nowrap text-[18px] text-foreground">OTC Market</h3>
                <p className="text-[16px] text-[#C4C4C4] whitespace-pre-line">
                    Explore Opportunities Beyond the Exchange
                </p>
            </div>

            <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[420px_1fr] xl:grid-rows-1 xl:h-[60vh]">
                {children}
            </div>
        </div>
    )
}
