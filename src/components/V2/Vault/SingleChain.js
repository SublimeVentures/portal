import { cn } from "@/lib/cn";
import SingleChainIcon from "@/assets/v2/svg/single-chain.svg";

const SingleChain = ({ icon: Icon, active }) => {
    return (
        <div className="relative h-[43px]">
            <SingleChainIcon className="absolute" />
                
            <div className="relative flex items-center h-full justify-center w-max gap-3">
                <div className={cn("mx-1.5 flex items-center justify-center w-[31px] h-[31px] rounded-full bg-navy-500", {
                    "bg-primary-light-gradient": active
                })}>
                    <Icon className={cn("p-2 text-gray-200", { "text-foreground": active })} />
                </div>
            </div>
        </div>
    )
}

export default SingleChain;
