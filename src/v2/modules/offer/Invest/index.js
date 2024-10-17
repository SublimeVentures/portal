import { useOfferDetailsQuery } from "../queries";
import EmptyState from "../EmptyState";
import Invest from "./Invest";
import CalculateModal from "./Modals/CalculateModal";
import UpgradesModal from "./Modals/UpgradesModal";
import { allUsedUpgradePhases } from "./Modals/UpgradesModal/utils";
import { routes } from "@/v2/routes";
import { PhaseId } from "@/v2/lib/phases";
import { cn } from "@/lib/cn";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { Badge } from "@/v2/components/ui/badge";

export default function Investment({ session, className }) {
    const { phaseCurrent, isClosed } = usePhaseInvestment();
    const { upgradesUse } = useOfferDetailsStore();
    const { data: offer } = useOfferDetailsQuery();

    const displayGuaranteed =
        !!upgradesUse?.guaranteedUsed &&
        upgradesUse.guaranteedUsed?.alloUsed != upgradesUse.guaranteedUsed?.alloMax &&
        phaseCurrent.phase != PhaseId.Unlimited &&
        !offer.isLaunchpad;

    const isUpgradeAvailable = allUsedUpgradePhases.includes(phaseCurrent.phase);

    return (
        <div className={cn("p-4 flex flex-col space-y-4 rounded bg-alt border-alt", className)}>
            <div className="flex flex-wrap items-center justify-between gap-4 xl:flex-nowrap">
                <div className="flex gap-2 items-center">
                    <h2 className="text-xl md:text-2xl font-medium font-heading">Invest</h2>
                    {/* <Tooltip>
                        <TooltipTrigger
                            className="size-4 rounded-full bg-white/15 text-2xs flex items-center justify-center cursor-help hover:bg-white/20 transition-colors duration-200"
                            asChild
                        >
                            <span>?</span>
                        </TooltipTrigger>
                        <TooltipContent>Something to show</TooltipContent>
                    </Tooltip> */}
                </div>

                <div className="ml-auto flex items-center gap-4 xl:order-3 xl:ml-0">
                    {isUpgradeAvailable && <UpgradesModal />}
                    <CalculateModal />
                </div>

                <div className="w-full xl:ml-auto xl:order-2 xl:w-max">
                    {displayGuaranteed && <Badge variant="warning">Guaranteed</Badge>}
                </div>
            </div>

            {isClosed ? (
                <div className="h-96">
                    <EmptyState
                        heading="Investment closed"
                        description="Although this investment is no longer available, you can explore other opportunities. Head over to our OTC page for secondary market options or visit our Opportunity page to find the latest investments."
                        cta={{ text: "Opportunities", href: routes.Opportunities, variant: "outline" }}
                        secondaryCta={{
                            text: "OTC Market",
                            href: {
                                pathname: routes.OTC,
                                query: offer.otc !== 0 ? { market: offer.slug, view: "offers" } : {},
                            },
                            variant: "gradient",
                        }}
                    />
                </div>
            ) : (
                <Invest session={session} />
            )}
        </div>
    );
}
