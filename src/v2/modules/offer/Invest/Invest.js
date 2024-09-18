import useInvest from "./useInvest";
import InvestForm from "./InvestForm";
import InvestFormFields from "./InvestFormFields";
import InvestFormSummary from "./InvestFormSummary";
import InvestFormSubmit from "./InvestFormSubmit";
import InvestModal from "../Invest/Modals/InvestModal";
import RestoreModal from "../Invest/Modals/RestoreModal";
import InvestErrorModal from "../Invest/Modals/InvestErrorModal";

export default function Invest({ session }) {
    const {
        isBooked,
        getInvestFormProps,
        getInvestFormFieldsProps,
        getInvestFormSummaryProps,
        getInvestFormSubmitProps,
        getInvestErrorModalProps,
    } = useInvest(session);

    return (
        <>
            <div className="relative flex flex-col flex-1 justify-center items-center">
                <div className="w-full lg:p-4 2xl:p-8">
                    <h3 className="mb-12 text-base lg:text-xl">My Contribution</h3>

                    <InvestForm {...getInvestFormProps()}>
                        <InvestFormFields {...getInvestFormFieldsProps()} />
                        <InvestFormSummary {...getInvestFormSummaryProps()} />
                        <InvestFormSubmit {...getInvestFormSubmitProps()} />
                    </InvestForm>
                                        
                    {isBooked && (
                        <p className="text-sm text-green-500 text-center">
                            All spots booked! Awaiting blockchain confirmations. <br />
                            <Linker url={ExternalLinks.BOOKING_SYSTEM} text={"Check back soon."} />
                        </p>
                    )}
                </div>
            </div>

            {/* <InvestModal isOpen={isInvestModalOpen} setOpen={setIsInvestModalOpen} /> */}
            <InvestErrorModal {...getInvestErrorModalProps()} />
            {/* <RestoreModal /> */}
        </>
    );
}
