import { useRef, useEffect } from "react";

const useOutsideClick = (callback) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (evt) => {
            if (ref.current && !ref.current.contains(evt.target)) callback();
        };

        document.addEventListener("mousedown", handleClick, true);
        return () => document.removeEventListener("mousedown", handleClick, true);
    }, [callback]);

    return ref;
};

export default useOutsideClick;
