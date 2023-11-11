import {useState, useEffect} from "react";

export default function FallbackImage({src, fallbackSrc, alt}) {
    const [currentSrc, setCurrentSrc] = useState(src || "");
    const [isIPFS, setIsIPFS] = useState(false);

    const handleError = () => {
        setIsIPFS(false);
        setCurrentSrc(fallbackSrc);
    };

    useEffect(() => {
        if (src && src.includes("ipfs/")) {
            setIsIPFS(true);
        }
    }, [src]);

    return (
        !isIPFS ?
            <img
                className="flex rounded-full my-auto"
                src={currentSrc}
                alt={alt}
                key={currentSrc}
                onError={handleError}
            />
         :
            <img
                className="flex rounded-full my-auto"
                src={currentSrc}
                alt={alt}
                onError={handleError}
                key={currentSrc}
                crossOrigin='anonymous'
            />
    );
}


