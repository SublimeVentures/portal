import Lottie from "lottie-react";

import lottieOtc from "@/assets/lottie/otc.json";

export default function TransactionSuccess({ market, textCopy, amount }) {
    return (
        <div className="mx-10 my-4 sm:px-10 text-center">
            <h3 className="text-3xl font-medium px-4 text-foreground">Congratulations!</h3>
            <p className="my-4 text-lg text-foreground/[.9]">
                You have successfully created OTC offer to{" "}
                <span className="text-green-500 font-bold">
                    {textCopy} ${amount}
                </span>{" "}
                allocation in <span className="font-bold text-green-500">{market}</span>.
            </p>

            <div className={"flex flex-1 justify-center items-center"}>
                <Lottie
                    animationData={lottieOtc}
                    loop={true}
                    autoplay={true}
                    style={{ width: "320px", margin: "-40px auto 0px" }}
                />
            </div>
        </div>
    )
};
