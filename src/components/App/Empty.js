import Lottie from "lottie-react";
import lottieEmpty from "@/assets/lottie/empty2.json";

export default function Empty({ text, maxSize }) {
    return (
        <div className="max-h-3-4 text-center contents">
            <Lottie
                animationData={lottieEmpty}
                loop={true}
                autoplay={true}
                style={{
                    position: "relative",
                    width: "auto",
                    height: "100%",
                    maxHeight: `${maxSize ? maxSize : 700}px`,
                    maxWidth: `${maxSize ? maxSize : 700}px`,
                    margin: "0 auto",
                }}
            />

            <div className="text-2xl uppercase text-hero font-medium !text-3xl tracking-wider">
                {text ? text : "More opportunities soon..."}
            </div>
        </div>
    );
}
