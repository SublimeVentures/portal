import { useEffect } from "react";

import useOTCStore from "../logic/store";

export default function Markets({ children, session }) {
    const setSession = useOTCStore(state => state.setSession);
    
    useEffect(() => {
        setSession(session);
    }, [session, setSession]);

    return (
        <div className="h-[60vh] mb-8 pb-8 p-4 flex flex-col gap-8">
            <div className="pb-16 p-4 flex flex-col gap-8">{children}</div>
        </div>
    )
}
