import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";

export default function OfferDetailsInvestClosed({paramsInvestClosed}) {
    const { session, isClosed, offer } = paramsInvestClosed

    const generateText = () => {
        if(isClosed) return "Investment closed"
        if(session.user.ACL !== 0 && offer.access === 0) {
            return <>Investment reserved only for <Linker url={ExternalLinks.WHALE_CLUB} text={"3VC Whales"}/></>
        } else {
            return "Investment closed."
        }
    }

    return (
        <div className="flex flex-col flex-1 justify-center items-center relative backdrop-blur-md rounded-xl" >
                    <div className="relative text-app-white uppercase text-2xl p-8 text-center rounded-xl">{generateText()}</div>
        </div>
        // <div className="flex flex-col flex-1 justify-center items-center relative" >
        //     <div>
        //         <div className="before:block before:absolute before:-inset-1 before:-skew-y-2 before:border before:border-app-accent2 relative before:!backdrop-blur-md ">
        //             <div className="relative text-app-white uppercase text-2xl p-8 text-center">{generateText()}</div>
        //         </div>
        //     </div>
        // </div>

)
}
