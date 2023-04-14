
import {useEffect, useRef} from "react";

export default function Updates({}) {
    const ref = useRef(null);

    // useEffect(() => {
        // import('@lottiefiles/lottie-player');
    // }, []);


    return (
        <div className="flex flex-1 flex-col bg-navy-accent rounded-xl justify-center items-center relative">
            <div className="absolute  bottom-10">No notifications on radar</div>
            <lottie-player
                ref={ref}
                autoplay
                loop
                style={{height: '200px'}}
                mode="normal"
                src="/static/lottie/notifs.json"
            />
        </div>
    )
}
