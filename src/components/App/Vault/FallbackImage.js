import {useState} from "react";

export default function FallbackImage({src, fallbackSrc, alt}) {
    const [currentSrc, setCurrentSrc] = useState(src || "");

    const handleError = () => {
        setCurrentSrc(fallbackSrc);
    };

    return (
        <img
            className="flex rounded-full my-auto"
            src={currentSrc}
            alt={alt}
            onError={handleError}
            key={currentSrc}
        />
    );
}


