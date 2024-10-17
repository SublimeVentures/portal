import Lottie from "lottie-react";

import lottieSuccess from "@/assets/lottie/success.json";

export default function TransactionSuccess({ title, description }) {
    return (
        <>
            <h3 className="text-2xl font-medium text-white text-center">{title}</h3>
            <p className="mb-2 text-md text-white text-center">{description}</p>

            <Lottie
                animationData={lottieSuccess}
                loop={true}
                autoplay={true}
                style={{ width: "320px", margin: "30px auto 0px" }}
            />
        </>
    );
}
