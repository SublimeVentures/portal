// import { getTenantConfig } from "@/lib/tenantHelper";
import { BookingErrorsENUM } from "@/lib/enum/invest";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import ExternalLink from "@/v2/components/ui/external-link";
import { ExternalLinks } from "@/routes";

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
                <div className="mb-8">
                    There are some <span className="text-accent">pending transactions</span> that booked the remaining
                    allocation.
                </div>
                <div className="mb-4">
                    <span className="font-bold">There is still a chance!</span>
                    <br />
                    Bookings are <span className="text-error">expiring after 15 minutes</span>.
                </div>
                <div>
                    Please wait for the button to enable back again!{" "}
                    <ExternalLink href={ExternalLinks.BOOKING_SYSTEM} />
                </div>
            </>
        ),
    },
    [BookingErrorsENUM.IsPaused]: {
        title: "Investment Paused",
        description: (
            <>
                Investment is <span className="text-accent">currently paused</span>.
                <br />
                <br />
                Please wait for the Discord update from the staff. <ExternalLink href={ExternalLinks.SUPPORT} />
            </>
        ),
    },
    [BookingErrorsENUM.NotOpen]: {
        title: "Investment Not Open",
        description: (
            <>
                Investment is <span className="text-accent">not yet open</span>.
                <br />
                <br />
                Don't cheat the timer! <ExternalLink href={ExternalLinks.BOOKING_SYSTEM} />
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
