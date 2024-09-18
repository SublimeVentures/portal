import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import { shortenAddress } from "@/v2/lib/helpers";
import useImage from "@/v2/hooks/useImage";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { useOfferDetailsQuery } from "../queries";

// @TODO - Create reusable Definition Items components
// Code from Mystery Box
function DefinitionTerm({ children, className }) {
    return <dt className={cn("text-xs text-foreground/70 3xl:text-sm font-light leading-7 self-end", className)}>{children}</dt>;
}

function DefinitionDescription({ children, className }) {
    return <dd className={cn("text-sm text-foreground 3xl:text-lg leading-7 font-medium", className)}>{children}</dd>;
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

export default function CancelReservationModal({ isDisabled }) {
    const { account: { address } } = useEnvironmentContext();
    const { data: offer } = useOfferDetailsQuery();
    const { getResearchIconSrc } = useImage();

    return (
        <Dialog>
            <DialogTrigger>
                <>
                    <Button
                        className="hidden self-center md:block"
                        variant="outline"
                        // disabled={isDisabled}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="md:hidden px-5"
                        variant="secondary"
                        // disabled={isDisabled}
                    >
                        <CrossIcon className="size-3" />
                    </Button>
                </>  
            </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Reservation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel following reservation?
                    </DialogDescription>
                </DialogHeader>

                <div className="my-2 px-4 py-4 flex gap-x-4 bg-white/[.04] md:px-8">
                    <DefinitionList className="grid-cols-5 w-full">
                        <Definition term="Logo" termClassName="sr-only" descClassName="row-span-2">
                            <div className="h-full flex items-center justify-center w-16">
                            <Image
                                src={getResearchIconSrc(offer.slug)}
                                className="rounded"
                                alt={`Avatar for ${name} offer`}
                                width={90}
                                height={90}
                            />
                            </div>
                        </Definition>
                        <Definition term="Project">{offer.name}</Definition>
                        <Definition term="Me">{shortenAddress(address ?? "")}</Definition>
                        <Definition term="Date">...</Definition>
                        <Definition term="Amount">...</Definition>
                    </DefinitionList>
                </div>

                <DialogFooter className="lg:flex-row items-center justify-between">
                    <p className="order-2 text-sm text-foreground/50 lg:order-1">
                      Investment amount will be send back to your wallet within 3 days.
                    </p>
                    <div className="ordero-1 flex items-center gap-2 lg:order-2">
                        <DialogPrimitive.Close asChild>
                            <Button variant="outline">Back</Button>
                        </DialogPrimitive.Close>
                        
                        <Button>Confirm Cancellation</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
