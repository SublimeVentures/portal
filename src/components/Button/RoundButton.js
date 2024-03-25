import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";

export const ButtonIconSize = {
    hero: "w-8 mr-5 text-2xl",
    hero5: "w-6 mr-5 text-xl",
    hero2: "w-6 mr-5 text-xl",
    hero4: "w-6 mr-2 text-xl",
    hero3: "w-6 text-xl",
    hero3center: "w-6 mx-auto text-xl",
    small: "w-8 text-2xl",
    vsmall: "w-6 -ml-2 -mr-2 text-xl",
    clicks: "w-5 text-xl",
    clicksLow: "w-[18px] mt-[1px] mr-1 text-xl",
    clicks2: "w-3 text-xl",
    invest: "w-9 mr-5 text-2xl",
    default: "w-8 mr-5"
};

export function RoundButton({
    text,
    isLoading,
    isLoadingWithIcon,
    isDisabled,
    showParticles,
    is3d,
    isPrimary,
    isWide,
    isWider,
    size,
    zoom,
    icon,
    handler,
}) {
    const [isActive, setIsActive] = useState(false);
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
        if (showParticles) {
            setIsActive(true);
            setTimeout(function () {
                setIsActive(false);
            }, 2000);
        }
        if (handler) {
            await handler();
        }
        setExecuting(false);
    };

    return (
        <div className={`v-align ${isActive ? "active" : ""}`}>
            <div
                className={`
              btn-wrap
              ${showParticles ? "particles" : ""}
              ${isPrimary ? "full-btn" : ""}
              ${!isPrimary ? "out-btn" : ""}
              ${isLoading || isDisabled || isExecuting ? "disabled" : ""}  
            `}
            >
                <button className={`btn ${size}`} onClick={animate} ref={tilt}>
                    <div
                        className={`
                      flex items-center justify-center relative
                      ${isWide && "ls-md"}
                      ${isWider && "ls-lg"}
                    `}
                    >
                        {isLoading ? (
                            <>{isLoadingWithIcon && icon}Loading...</>
                        ) : (
                            <>
                                {icon}
                                {text}
                            </>
                        )}
                    </div>
                </button>

                {showParticles && (
                    <div>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                        <span className="particles-circle"></span>
                    </div>
                )}
            </div>
        </div>
    );
}
