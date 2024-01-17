import {isBased} from "@/lib/utils";

export default function OfferDetailsInvestClosed({}) {
    return (
        <div className="flex flex-col flex-1 justify-center items-center relative backdrop-blur-md rounded-xl">
            <div className={`${isBased ? "text-app-white" : "font-accent text-app-error glowRed font-light"} relative  uppercase text-2xl p-8 text-center rounded-xl`}>Investment
                closed
            </div>
        </div>
    )
}
