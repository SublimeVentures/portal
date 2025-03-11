import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { BookingErrorsENUM } from "@/lib/enum/invest";

const renderError = (code) => {
    switch (code) {
        case BookingErrorsENUM.BadCurrency: {
            return (
                <>
                    Your transaction could not be processed.
                    <br />
                    Encountered error while processing payment currency.
                    <br />
                    <br /> Please report issue on Discord.
                </>
            );
        }
        case BookingErrorsENUM.Overallocated: {
            return (
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
                    Please wait for button to enable back again!
                    <div className="mt-5">
                        <Linker url={ExternalLinks.BOOKING_SYSTEM} />
                    </div>
                </>
            );
        }
        case BookingErrorsENUM.IsPaused: {
            return (
                <>
                    Investment is <span className="text-gold contents">currently paused</span>
                    .
                    <br />
                    <br />
                    Please wait for the Discord update from the staff.
                    <div className="mt-5">
                        <Linker url={ExternalLinks.OFFER_PHASES} />
                    </div>
                </>
            );
        }
        case BookingErrorsENUM.NotOpen: {
            return (
                <>
                    Investment is <span className="text-gold contents">not yet open</span>.
                    <br />
                    <br />
                    Don't cheat the timer!
                    <div className="mt-5">
                        <Linker url={ExternalLinks.OFFER_PHASES} />
                    </div>
                </>
            );
        }
        default: {
            return <>Couldn't process request: ${code}</>;
        }
    }
};

export default function ErrorModal({ model, setter, errorModalProps }) {
    const { code } = errorModalProps;
    const title = () => {
        return (
            <>
                Booking <span className="text-app-error">error</span>
            </>
        );
    };

    const content = () => {
        return <div className={""}>{renderError(code)}</div>;
    };

    return <GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />;
}
