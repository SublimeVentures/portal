import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";

export const ButtonIconSize = {
    hero: "w-8 mr-5",
    small: "w-8",
    vsmall: "w-6 -ml-2 -mr-2",
    clicks: "w-5",
    invest: "w-9 mr-5",
};

export function IconButton({
    isDisabled,
    is3d,
    isPrimary,
    size,
    zoom,
    icon,
    handler,
    noBorder,
}) {
    const [isExecuting, setExecuting] = useState(false);
    const tilt = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tilt.current, {
            scale: zoom ? zoom : 1,
            speed: 1000,
            max: is3d ? 10 : 1,
        });
    }, [zoom]);

    const animate = async () => {
        if (isExecuting) return;
        setExecuting(true);
        if (handler) {
            await handler();
        }
        setExecuting(false);
    };

    return (
        <div
            className={`
              btn-wrap icons
              ${isPrimary ? "full-btn" : ""}
              ${!isPrimary ? "out-btn" : ""}
              ${isDisabled || isExecuting ? "disabled" : ""}  
            `}
        >
            <button
                className={`btn ${noBorder ? "onlyIcon" : ""} ${size}`}
                onClick={animate}
                ref={tilt}
            >
                <div className={`flex items-center justify-center relative`}>
                    {icon}
                </div>
            </button>
        </div>
    );
}
