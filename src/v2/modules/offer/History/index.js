import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { cn } from "@/lib/cn";
import { fetchOfferParticipants } from "@/fetchers/offer.fetcher";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { formatCurrency } from "@/v2/helpers/formatters";

import CancelReservationModal from "./CancelReservationModal";

const offerParticipantsOptions = (offerId, config) => ({
    queryKey: ["offerParticipants", offerId],
    queryFn: () => fetchOfferParticipants(offerId, config),
});

const useOfferParticipantsQuery = (offerId, options) => {
    return useQuery({
        ...offerParticipantsOptions(offerId),
        ...options,
    });
};

const Definition = ({ term, children, termClassName, descClassName }) => (
    <>
        <dt className={cn("text-xs md:text-sm font-light", termClassName)}>{term}:</dt>
        <dd className={cn("text-sm md:text-base font-medium", descClassName)}>{children}</dd>
    </>
);

export default function History({ className }) {
    const { data: offer } = useOfferDetailsQuery();
    const { data: participants = [], isLoading } = useOfferParticipantsQuery(offer.id, {
        enabled: !!offer.id,
    });

    return (
        <div className={cn("p-6 rounded bg-white/[.07] backdrop-blur-3xl flex flex-col gap-6", className)}>
            <h2 className="ext-xl md:text-2xl font-medium">History</h2>
            <ul className="overflow-y-auto md:max-h-44 -my-2 -mr-2 pr-2">
                {isLoading ? (
                    <>
                        <Skeleton className="h-19 my-2" />
                        <Skeleton className="h-19 my-2" />
                    </>
                ) : participants.length === 0 ? (
                    <li className="bg-white/[.04] md:h-44 flex flex-col items-center justify-center gap-4 p-6">
                        <h3 className="tracking-tight text-base md:text-lg font-medium text-foreground">
                            Investment History Unavailable
                        </h3>
                        <p className="max-w-md text-xs md:text-sm font-light text-foreground/50 text-center">
                            Your investment history for this offer is currently empty, but no worries! As you make
                            investments, this section will update.
                            <br />
                            Check back later for more details as they become available.
                        </p>
                    </li>
                ) : (
                    participants.map((participant) => (
                        <li key={participant.id} className="bg-white/[.04] gap-x-4 px-4 md:px-8 py-4 flex my-2">
                            <dl className="grid gap-x-4 grid-cols-2 md:grid-cols-4 grow">
                                <Definition
                                    term="Hash"
                                    termClassName="hidden md:block md:order-1"
                                    descClassName="hidden md:block md:order-5"
                                >
                                    {participant.hash}
                                </Definition>
                                <Definition
                                    term="Date"
                                    termClassName="col-span-2 order-5 md:col-auto md:order-2 pt-4 md:pt-0"
                                    descClassName="col-span-2 order-6 md:col-auto md:order-6"
                                >
                                    {moment(participant.createdAt).utc().local().format("lll")}
                                </Definition>
                                <Definition
                                    term="Status"
                                    termClassName="order-2 md:order-3"
                                    descClassName="order-4 md:order-7"
                                >
                                    {participant.isConfirmed && <span className="text-success">Confirmed</span>}
                                    {participant.isConfirmedInitial && !participant.isConfirmed && (
                                        <span className="text-yellow-500">Reserved</span>
                                    )}
                                    {participant.isExpired && <span className="text-error">Expired</span>}
                                    {participant.isGuaranteed && <span className="text-accent">Guaranteed</span>}
                                </Definition>
                                <Definition
                                    term="Amount"
                                    termClassName="order-1 md:order-4"
                                    descClassName="order-3 md:order-8"
                                >
                                    {formatCurrency(participant.amount)}
                                </Definition>
                            </dl>

                            <CancelReservationModal isDisabled={!(participant.isConfirmedInitial && !participant.isConfirmed)} />
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
