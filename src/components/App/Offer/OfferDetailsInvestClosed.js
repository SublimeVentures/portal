import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {is3VC} from "@/lib/seoConfig";

export default function OfferDetailsInvestClosed({paramsInvestClosed}) {
    const { account, isClosed, offer } = paramsInvestClosed

    const generateText = () => {
        if(isClosed) return "Investment closed"
        if(account.ACL !== 0 && offer.access === 0) {
            return <>Investment reserved only for <Linker url={ExternalLinks.WHALE_CLUB} text={"3VC Whales"}/></>
        } else {
            return "Investment closed."
        }
    }

    return (
        <div className="flex flex-col flex-1 justify-center items-center relative backdrop-blur-md rounded-xl" >
            <div className={`${is3VC ? "text-app-white" : "font-accent text-app-error glowRed font-light"} relative  uppercase text-2xl p-8 text-center rounded-xl`}>{generateText()}</div>
        </div>


)
}
