import { cn } from "@/lib/cn";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import { formatPercentage } from "@/v2/helpers/formatters";
import { Skeleton } from "@/v2/components/ui/skeleton";

const Definition = ({ term, children }) => (
    <>
        <dt className="order-first text-xs md:text-sm font-light">{term}:</dt>
        <dd className="text-base font-medium">{children}</dd>
    </>
);

export default function Vesting({ className }) {
    const { data: offer, isLoading } = useOfferDetailsQuery();
    return (
        <div className={cn("p-6 rounded bg-white/[.07] backdrop-blur-3xl flex flex-col gap-6", className)}>
            <h2 className="text-xl md:text-2xl font-medium">Vesting details</h2>
            <ul className="overflow-y-auto md:max-h-44 -my-2 -mr-3 pr-2">
                {isLoading ? (
                    <>
                        <li className="my-2">
                            <Skeleton className="h-19" />
                        </li>
                        <li className="my-2">
                            <Skeleton className="h-19" />
                        </li>
                    </>
                ) : offer.payouts.length > 0 ? (
                    offer.payouts.map((payout) => (
                        <li key={payout.id} className="my-2">
                            <dl className="bg-white/[.04] px-8 py-4 grid gap-x-4 grid-cols-3">
                                <Definition term="Event">
                                    {payout.offerPayout === 1 ? "TGE" : `V${payout.offerPayout - 1}`}
                                </Definition>
                                <Definition term="Date">{payout.unlockDate}</Definition>
                                <Definition term="Unlock">{formatPercentage(payout.percentage / 100)}</Definition>
                            </dl>
                        </li>
                    ))
                ) : (
                    <li className="bg-white/[.04] md:h-44 flex flex-col items-center justify-center gap-4 p-6">
                        <h3 className="tracking-tight text-base md:text-lg font-medium text-foreground">
                            Vesting details unavailable
                        </h3>
                        <p className="max-w-md text-xs md:text-sm font-light text-foreground/50 text-center">
                            The vesting details are currently unavailable, but no worries!
                            <br />
                            As your investments progress, this section will update with relevant information.
                            <br />
                            Stay tuned for updates as they come.
                        </p>
                    </li>
                )}
            </ul>
        </div>
    );
}
