import { useOfferDetailsQuery } from "../queries";
import InvestClosed from "./InvestClosed";
import Invest from "./Invest";
import CalculateModal from "./Modals/CalculateModal";
import UpgradesModal from "./Modals/UpgradesModal";
import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import { PhaseId } from "@/v2/lib/phases";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { Badge } from "@/v2/components/ui/badge";
import { cn } from "@/lib/cn";

// const { clearBooking, bookingDetails, setBooking, getSavedBooking } = useInvestContext();
// const data = useInvestContext(offer.id);
let isClosed = false; // @TODO: Remove

export default function Investment({ session, className }) {
    const { phaseCurrent, isClosed: isClosedTemp } = usePhaseInvestment();
    const { upgradesUse } = useOfferDetailsStore();
    const { data: offer } = useOfferDetailsQuery();

    const displayGuaranteed =
        !!upgradesUse?.guaranteedUsed &&
        guaranteedUsed?.alloUsed != guaranteedUsed?.alloMax &&
        phaseCurrent.phase != PhaseId.Unlimited &&
        !offer.isLaunchpad;

    return (
        <div className={cn("p-4 flex flex-col space-y-4 rounded bg-white/[.07] backdrop-blur-3xl", className)}>
            <div className="flex flex-wrap items-center justify-between gap-4 xl:flex-nowrap">
                <div className="flex gap-2 items-center">
                    <h2 className="text-lg font-semibold">Invest</h2>
                    <Tooltip>
                        <TooltipTrigger
                            className="size-4 rounded-full bg-white/[.14] text-2xs flex items-center justify-center cursor-help hover:bg-white/[.2] transition-colors duration-200"
                            asChild
                        >
                            <span>?</span>
                        </TooltipTrigger>
                        <TooltipContent>Something to show</TooltipContent>
                    </Tooltip>
                </div>

                <div className="ml-auto flex items-center gap-4 xl:order-3 xl:ml-0">
                    <UpgradesModal />
                    <CalculateModal />
                </div>

                <div className="w-full xl:ml-auto xl:order-2 xl:w-max">
                    {displayGuaranteed && <Badge variant="warning">Guaranteed</Badge>}
                </div>
            </div>

            <div className="px-6 py-4 bg-foreground/[.05] rounded">
                {isClosed ? <InvestClosed /> : <Invest session={session} />}
            </div>
        </div>
    );
}
