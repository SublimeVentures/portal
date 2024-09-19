import Image from "next/image";
import moment from "moment";

import { cn } from "@/lib/cn";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { shortenAddress } from "@/v2/lib/helpers";
import useImage from "@/v2/hooks/useImage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import { useOfferDetailsQuery } from "../../queries";

// @TODO - Create reusable Definition Items components
// Code from Mystery Box
function DefinitionTerm({ children, className }) {
    return <dt className={cn("text-xs text-foreground/70 3xl:text-sm font-light leading-7 self-end", className)}>{children}</dt>;
}

function DefinitionDescription({ children, className }) {
    return <dd className={cn("text-sm text-foreground 3xl:text-lg leading-7 font-medium text-nowrap", className)}>{children}</dd>;
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

export default function RestoreModal({ open, allocationOld, timeOld, onOpenChange, bookingRestore }) {
    const { account: { address } } = useEnvironmentContext();
    const { data: offer } = useOfferDetailsQuery();
    const { getResearchIconSrc } = useImage();

    const allocationOldLocal = Number(allocationOld).toLocaleString();
    const timeOldFormatted = moment(timeOld).format('YYYY.MM.DD HH:mm:ss');
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Restore Reservation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to restore following reservation?
                    </DialogDescription>
                </DialogHeader>

                <div className="my-2 px-4 py-4 flex gap-x-4 bg-white/[.04] md:px-8">
                    <DefinitionList className="grid-cols-5 w-full">
                        <Definition term="Logo" termClassName="sr-only" descClassName="row-span-2">
                            <div className="h-full flex items-center justify-center w-16">
                            <Image
                                src={getResearchIconSrc(offer.slug)}
                                className="rounded"
                                alt={`Avatar for ${offer.name} offer`}
                                width={90}
                                height={90}
                            />
                            </div>
                        </Definition>
                        <Definition term="Project">{offer.name}</Definition>
                        <Definition term="Me">{shortenAddress(address ?? "")}</Definition>
                        <Definition term="Date">{timeOldFormatted}</Definition>
                        <Definition term="Amount">${allocationOldLocal}</Definition>
                    </DefinitionList>
                </div>

                <DialogFooter className="lg:flex-row items-center justify-between">
                    <p className="order-2 text-sm text-foreground/50 lg:order-1">Reservation will be automaticaly restored.</p>
                    <div className="ordero-1 flex items-center gap-2 lg:order-2">
                        <Button variant="outline">Back</Button>
                        <Button onClick={bookingRestore}>Confirm Reservation</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// OLD CODE

// const allocationNewLocal = Number(investmentAmount).toLocaleString();

// export default function RestoreHashModal({ model, setter, restoreModalProps }) {
//     const { allocationOld, investmentAmount, bookingExpire, bookingRestore, bookingCreateNew } = restoreModalProps;
//     const { bookingDetails } = useInvestContext();

//     const content = () => {
//         return (
//             <div>
//                 <div className="flex flex-col gap-5 pb-5">
//                     <div>
//                         You have active booking for <span className="text-gold">${allocationOldLocal} allocation</span>,
//                         but you are trying to change the investment size.
//                     </div>
//                     <div>
//                         Would you like to{" "}
//                         <span className="text-app-success">restore existing booking (${allocationOldLocal})</span> or{" "}
//                         <span className="text-app-error">make new one (${allocationNewLocal})</span>?
//                     </div>
//                 </div>

//                 <div className="flex flex-col justify-center items-center gap-2">
//                     <div>Old booking is going to expire in</div>
//                     <CustomFlipClockCountdown
//                         className="flip-clock"
//                         onComplete={() => bookingExpire()}
//                         to={moment.unix(bookingDetails?.expires).valueOf()}
//                         labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
//                         labelStyle={{
//                             fontSize: 10,
//                             fontWeight: 500,
//                             textTransform: "uppercase",
//                             color: "white",
//                         }}
//                     />
//                 </div>

// <UniButton
// type={ButtonTypes.BASE}
// text="New Booking"
// state={""}
// isWide={true}
// zoom={1.1}
// size="text-sm sm"
// handler={bookingCreateNew}
// />