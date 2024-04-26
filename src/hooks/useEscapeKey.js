import { useEffect } from "react";

const useEscapeKey = (callback) => {
    useEffect(() => {
        const handleKeyDown = (evt) => {
            if (evt.key === 'Escape') callback();
        }

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [callback]);
};

export default useEscapeKey;
