import {useState} from "react";

export const CitCaGlitchButtonState = {
    danger: "danger",
    success: "success",
    filled: "active",
    hero: "hero",
}

export function CitCapGlitchButton({text, isLarge, state, handler}) {
    const [isExecuting, setExecuting] = useState(false)

    const click = async () => {
        if(isExecuting) return;
        setExecuting(true)

        if(handler) {
            await handler()
        }
        setExecuting(false)
        return true
    }


    return (
        <div text={text} className={`
            ${isLarge ? "large": ""}
            ${state}
            shakeBtn font-accent before:content-[attr(text)] after:content-[attr(text)]
            `} data-text={text} onClick={() => click()}>{ text }</div>
    )
}
