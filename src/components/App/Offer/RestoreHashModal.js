import moment from "moment";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import GenericModal from "@/components/Modal/GenericModal";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { useInvestContext } from "@/components/App/Offer/InvestContext";

export default function RestoreHashModal({ model, setter, restoreModalProps }) {
    const { allocationOld, investmentAmount, bookingExpire, bookingRestore, bookingCreateNew } = restoreModalProps;
    const { bookingDetails } = useInvestContext();
    const title = () => {
        return (
            <>
                Booking <span className="text-gold">detected</span>
            </>
        );
    };

    const allocationOldLocal = Number(allocationOld).toLocaleString();
    const allocationNewLocal = Number(investmentAmount).toLocaleString();
    const content = () => {
        return (
            <div>
                <div className="flex flex-col gap-5 pb-5">
                    <div>
                        You have active booking for{" "}
                        <span className="text-gold">${allocationOldLocal} allocation</span>, but you are trying to
                        change the investment size.
                    </div>
                    <div>
                        Would you like to{" "}
                        <span className="text-app-success">restore existing booking (${allocationOldLocal})</span> or{" "}
                        <span className="text-app-error">make new one (${allocationNewLocal})</span>?
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div>Old booking is going to expire in</div>
                    <FlipClockCountdown
                        className="flip-clock"
                        onComplete={() => bookingExpire()}
                        to={moment.unix(bookingDetails?.expires)}
                        labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
                        labelStyle={{
                            fontSize: 10,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            color: "white",
                        }}
                    />
                </div>

                <div className={`flex flex-col gap-5 flex-1 mt-10 fullWidth`}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text="Restore"
                        state="danger"
                        isWide={true}
                        isPrimary={true}
                        zoom={1.1}
                        size="text-sm sm"
                        handler={bookingRestore}
                    />
                    <UniButton
                        type={ButtonTypes.BASE}
                        text="New Booking"
                        state={""}
                        isWide={true}
                        zoom={1.1}
                        size="text-sm sm"
                        handler={bookingCreateNew}
                    />
                </div>
            </div>
        );
    };

    return <GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />;
}
