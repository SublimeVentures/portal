import { useEffect, useRef, useState } from "react";
import Scramble from "@/components/Scramble";

export const ButtonCitCapIconSize = {
    hero: "w-3 mr-3",
    hero2: "w-6 mr-5",
    small: "w-8",
    vsmall: "w-6 -ml-2 -mr-2",
    clicks: "w-5",
    invest: "w-9 mr-5",
};

export function CitCapButton({
    text,
    isWhite,
    isLoading,
    isDisabled,
    isLoadingWithIcon,
    icon,
    handler,
}) {
    const [isExecuting, setExecuting] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const click = async () => {
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
            btnScramble 
            cursor-pointer
            ${isWhite ? "white" : "dark"}
            ${isLoading || isDisabled || isExecuting ? "disabled" : ""}  
        `}
            onClick={click}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {isLoading ? (
                <>{isLoadingWithIcon && icon}Loading...</>
            ) : (
                <>
                    {icon}
                    <Scramble
                        text={text}
                        trigger={isHover}
                        isUnderline={true}
                    />
                </>
            )}
        </div>
    );
}
