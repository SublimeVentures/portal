// import { getTenantConfig } from "@/lib/tenantHelper";
import { BookingErrorsENUM } from "@/lib/enum/invest";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";

export default function InvestErrorModal({ code = "", ...props }) {
    const { title, description } = getError(code);

    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Action Failed</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="py-4 px-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-error-900 rounded">
                    <div className="text-center md:text-left text-error/90">
                        <h3 className="font-medium text-base">{title}</h3>
                        <p className="text-xs md:text-sm">Error code: {code}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const messages = {
    [BookingErrorsENUM.BadCurrency]: {
        title: "Transaction Error",
        description: (
            <>
                Your transaction could not be processed. <br />
                Encountered error while processing payment currency. <br />
                <br />
                Please report the issue on Discord.
            </>
        ),
    },
    [BookingErrorsENUM.Overallocated]: {
        title: "Overallocated Resources",
        description: (
            <>
                There are some <span className="text-gold contents">pending transactions</span> that booked the
                remaining allocation.
                <br />
                <br />
                <div className="font-bold">There is still a chance!</div>
                <div>
                    Bookings are <span className={"text-app-error contents"}>expiring after 15 minutes</span>.
                </div>
                <br />
                Please wait for the button to enable back again!
                {/* <div className="mt-5">
                    <Linker url={externalLinks.BOOKING_SYSTEM} />
                </div> */}
            </>
        ),
    },
    [BookingErrorsENUM.IsPaused]: {
        title: "Investment Paused",
        description: (
            <>
                Investment is <span className="text-gold contents">currently paused</span>.
                <br />
                <br />
                Please wait for the Discord update from the staff.
                {/* <div className="mt-5">
                    <Linker url={externalLinks.OFFER_PHASES} />
                </div> */}
            </>
        ),
    },
    [BookingErrorsENUM.NotOpen]: {
        title: "Investment Not Open",
        description: (
            <>
                Investment is <span className="text-gold contents">not yet open</span>.
                <br />
                <br />
                Don't cheat the timer!
                {/* <div className="mt-5">
                    <Linker url={externalLinks.OFFER_PHASES} />
                </div> */}
            </>
        ),
    },
    default: {
        title: "Connection Issue",
        description: (
            <>
                Oops! Something went wrong while processing your request. <br />
                Please check your connection or try again later
            </>
        ),
    },
};

const getError = (code) => {
    return messages[code] || messages.default;
};
