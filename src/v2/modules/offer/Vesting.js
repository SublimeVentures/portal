import EmptyState from "./EmptyState";
import { cn } from "@/lib/cn";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { formatPercentage } from "@/v2/helpers/formatters";

const Definition = ({ term, children }) => (
    <>
        <dt className="order-first text-xs md:text-sm font-light">{term}:</dt>
        <dd className="text-base font-medium">{children}</dd>
    </>
);

export default function Vesting({ className }) {
    const { data: offer, isLoading } = useOfferDetailsQuery();

    return (
        <div className={cn("p-6 rounded bg-alt flex flex-col gap-6 select-none border-alt", className)}>
            <h2 className="text-xl md:text-2xl font-medium">Vesting details</h2>

            <div className="h-full min-h-40">
                {isLoading && (
                    <div className="h-full flex flex-col space-y-2">
                        <Skeleton count={2} className="h-full" />
                    </div>
                )}

                {offer?.payouts?.length > 0 && !isLoading && (
                    <ul className="-my-2 -mr-2 pr-2 max-h-80 overflow-y-auto md:max-h-44">
                        {offer.payouts.map((payout) => (
                            <li key={payout.id} className="my-2">
                                <dl className="bg-white/5 px-8 py-4 grid gap-x-4 grid-cols-3">
                                    <Definition term="Event">
                                        {payout.offerPayout === 1 ? "TGE" : `V${payout.offerPayout - 1}`}
                                    </Definition>
                                    <Definition term="Date">{payout.unlockDate}</Definition>
                                    <Definition term="Unlock">{formatPercentage(payout.percentage / 100)}</Definition>
                                </dl>
                            </li>
                        ))}
                    </ul>
                )}

                {offer.payouts.length === 0 && !isLoading && (
                    <EmptyState
                        heading="Vesting Details Unavailable"
                        description="The vetting details are currently unavailable. As your investment progresses, this section will display updated information. Stay tuned for updates as they come."
                    />
                )}
            </div>
        </div>
    );
}
