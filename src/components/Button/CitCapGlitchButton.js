import { useState } from "react";

export const CitCaGlitchButtonState = {
    danger: "danger",
    success: "success",
    filled: "active",
    hero: "hero",
};

export function CitCapGlitchButton({
    text,
    state = "",
    handler,
    isLoading,
    isDisabled,
    icon,
    isFullwidth,
    innerClassName = "",
}) {
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
            block relative outline-none bg-none cursor-pointer border border-white text-white py-1.5 px-5 font-heading hover:bg-white hover:text-black transition-color
             ${process.env.NEXT_PUBLIC_TENANT == "19" ? "" : "glitch text-sm"}
            `}
            data-text={text}
            onClick={() => click()}
        >
            <span
                className={`
                flex flex-row justify-center items-center text-nowrap
                ${innerClassName}
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
