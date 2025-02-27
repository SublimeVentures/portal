import { useState } from "react";

export const CitCaGlitchButtonState = {
    danger: "danger",
    success: "success",
    filled: "active",
    hero: "hero",
};

export function CitCapGlitchButton({ text, state, handler, isLoading, isDisabled, icon, isFullwidth }) {
    const [isExecuting, setExecuting] = useState(false);

    const click = async () => {
        if (isExecuting) return;
        setExecuting(true);

        if (handler) {
            await handler();
        }
        setExecuting(false);
        return true;
    };

    return (
        <div
            text={text}
            className={`
            ${state}
            ${isDisabled ? "disabled" : ""}
            shakeBtn font-accent before:content-[attr(text)] after:content-[attr(text)]  
             ${process.env.NEXT_PUBLIC_TENANT == "19" ? "!pt-[6px]" : "glitch"}
            `}
            data-text={text}
            onClick={() => click()}
        >
            <span
                className={`
                flex flex-row justify-center items-center text-nowrap
                 ${process.env.NEXT_PUBLIC_TENANT == "19" ? "!pt-[3px]" : ""}
            `}
            >
                {isLoading ? (
                    <>Loading...</>
                ) : (
                    <>
                        {icon}
                        {text}
                    </>
                )}
            </span>
        </div>
    );
}
