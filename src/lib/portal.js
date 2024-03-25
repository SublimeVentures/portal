import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const Portal = ({ children, selector = "portal-root", show = true }) => {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = document.getElementById(selector);
    }, [selector]);

    return show && ref.current ? createPortal(children, ref.current) : null;
};
