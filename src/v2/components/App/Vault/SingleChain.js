import { cn } from "@/lib/cn";
import SingleChainIcon from "@/v2/assets/svg/single-chain.svg";

const SingleChain = ({ icon: Icon, active }) => {
    return (
        <div className="relative h-[43px]">
            <div className="relative flex items-center h-full justify-center w-max gap-3 hover:scale-110 transition-all">
                <div
                    className={cn(
                        "mx-1.5 flex items-center justify-center w-[31px] h-[31px] rounded-full bg-primary-700 hover:bg-primary-700",
                        {
                            "bg-gradient-to-t from-primary to-primary-600": active,
                        },
                    )}
                >
                    <Icon className={cn("p-2 text-white/60", { "text-white": active })} />
                </div>
            </div>
        </div>
    );
};

export default SingleChain;
