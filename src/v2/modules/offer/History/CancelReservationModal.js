import { useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import moment from "moment";

import { useOfferDetailsQuery } from "../queries";
import { queryClient } from "@/lib/queryCache";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import { shortenAddress } from "@/v2/lib/helpers";
import useImage from "@/v2/hooks/useImage";
import { cancelOfferParticipant } from "@/fetchers/offer.fetcher";
import { formatCurrency } from "@/v2/helpers/formatters";
import { offersKeys } from "@/v2/constants";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import CrossIcon from "@/v2/assets/svg/cross.svg";

// @TODO - Create reusable Definition Items components
// Code from Mystery Box
function DefinitionTerm({ children, className }) {
    return (
        <dt className={cn("text-xs text-foreground/70 font-light self-end md:leading-7 3xl:text-sm", className)}>
            {children}
        </dt>
    );
}

function DefinitionDescription({ children, className }) {
    return (
        <dd className={cn("text-sm text-foreground font-medium text-nowrap leading-7 3xl:text-base", className)}>
            {children}
        </dd>
    );
}

function Definition({ children, term, termClassName, descClassName }) {
    return (
        <>
            <DefinitionTerm className={termClassName}>{term}</DefinitionTerm>
            <DefinitionDescription className={descClassName}>{children}</DefinitionDescription>
        </>
    );
}

function DefinitionList({ children, className }) {
    return <dl className={cn("grid grid-rows-2 grid-flow-col", className)}>{children}</dl>;
}

export default function CancelReservationModal({ participantId, amount, date, isDisabled }) {
    const {
        account: { address },
    } = useEnvironmentContext();
    const { data: offer } = useOfferDetailsQuery();
    const { getResearchIconSrc } = useImage();

    const [isProcessing, setIsProcessing] = useState(false);
    const dateFormatted = moment(date).format("YYYY.MM.DD - HH:mm:ss");
    const amountFormatted = formatCurrency(amount);

    const handleConfirmCancel = async () => {
        if (!offer.id || !participantId || isDisabled || isProcessing) return;
        setIsProcessing(true);

        try {
            const res = await cancelOfferParticipant(offer.id, participantId);

            if (res?.ok) {
                await Promise.all([
                    queryClient.invalidateQueries(offersKeys.offerParticipants()),
                    queryClient.invalidateQueries(offersKeys.offerDetails()),
                ]);
            }
        } catch (err) {
            console.log("err", err);
        }

        setIsProcessing(false);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <>
                    <Button className="hidden self-center md:block" variant="outline" disabled={isDisabled}>
                        Cancel
                    </Button>
                    <Button className="md:hidden px-5" variant="secondary" disabled={isDisabled}>
                        <CrossIcon className="size-3" />
                    </Button>
                </>
            </DialogTrigger>

            <DialogContent className="max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Cancel Reservation</DialogTitle>
                    <DialogDescription>Are you sure you want to cancel following reservation?</DialogDescription>
                </DialogHeader>

                <div className="my-2 px-4 py-4 flex flex-col gap-x-4 bg-white/[.04] md:px-8 md:flex-row">
                    <DefinitionList className="grid-cols-[45%,1fr] grid-rows-6 w-full md:grid-cols-[72px,auto,auto,auto,auto] md:grid-rows-1">
                        <Definition term="Logo" termClassName="sr-only" descClassName="row-span-2">
                            <div className="h-full flex items-center justify-center w-12">
                                <Image
                                    src={getResearchIconSrc(offer.slug)}
                                    className="rounded"
                                    alt={`Avatar for ${offer.name} offer`}
                                    width={90}
                                    height={90}
                                />
                            </div>
                        </Definition>
                        <Definition termClassName="md:order-4" descClassName="md:order-4" term="Amount">
                            {amountFormatted}
                        </Definition>
                        <Definition termClassName="md:order-3" descClassName="md:order-3" term="Date">
                            {dateFormatted}
                        </Definition>
                        <Definition termClassName="md:order-1" descClassName="md:order-1" term="Project">
                            {offer.name}
                        </Definition>
                        <Definition termClassName="md:order-2" descClassName="md:order-2" term="Me">
                            {shortenAddress(address ?? "")}
                        </Definition>
                    </DefinitionList>
                </div>

                <DialogFooter className="md:flex-row items-center justify-between">
                    <p className="order-2 text-xs text-foreground/50 md:order-1 md:text-sm">
                        Investment amount will be send back to your wallet within 3 days.
                    </p>
                    <div className="w-full order-1 flex flex-col-reverse gap-2 md:w-max md:flex-row md:items-center md:order-2">
                        <DialogPrimitive.Close asChild>
                            <Button variant="outline">Back</Button>
                        </DialogPrimitive.Close>

                        <Button onClick={handleConfirmCancel} isDisabled={isDisabled || isProcessing}>
                            Confirm Cancellation
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
