import { cn } from "@/lib/cn";
import SingleChainIcon from "@/v2/assets/svg/single-chain.svg";

const SingleChain = ({ icon: Icon, active }) => {
    return (
        <div className="relative h-[43px]">
            <SingleChainIcon className="absolute" />

            <div className="relative flex items-center h-full justify-center w-max gap-3 hover:scale-110 transition-all">
                <div
                    className={cn(
                        "mx-1.5 flex items-center justify-center w-[31px] h-[31px] rounded-full bg-navy-500 hover:bg-navy-300",
                        {
                            "bg-primary-light-gradient": active,
                        },
                    )}
                >
                    <Icon className={cn("p-2 text-gray-200", { "text-foreground": active })} />
                </div>
            </div>
        </div>
    );
};

export default SingleChain;
