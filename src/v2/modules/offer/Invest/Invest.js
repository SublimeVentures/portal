import InvestErrorModal from "../Invest/Modals/InvestErrorModal";
import RestoreModal from "../Invest/Modals/RestoreModal";
import InvestModal from "../Invest/Modals/InvestModal";
import useInvest from "./useInvest";
import InvestForm from "./InvestForm";
import InvestFormFields from "./InvestFormFields";
import InvestFormSummary from "./InvestFormSummary";
import InvestFormSubmit from "./InvestFormSubmit";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";

export default function Invest({ session }) {
    const {
        isBooked,
        getInvestFormProps,
        getInvestFormFieldsProps,
        getInvestFormSummaryProps,
        getInvestFormSubmitProps,
        getInvestModalProps,
        getRestoreModalProps,
        getInvestErrorModalProps,
    } = useInvest(session);

    return (
        <div className="px-6 py-4 h-full bg-foreground/[.05] rounded 3xl:py-8 3xl:px-12">
            <div className="relative flex flex-col flex-1 justify-center items-center">
                <div className="w-full">
                    <h3 className="mb-12 text-base lg:text-xl">My Contribution</h3>
                    <InvestForm {...getInvestFormProps()}>
                        <InvestFormFields {...getInvestFormFieldsProps()} />
                        <InvestFormSummary {...getInvestFormSummaryProps()} />
                        <InvestFormSubmit {...getInvestFormSubmitProps()} />

                        <InvestModal {...getInvestModalProps()} />
                    </InvestForm>

                    {isBooked && (
                        <p className="text-sm text-green-500 text-center">
                            All spots booked! Awaiting blockchain confirmations. <br />
                            <Linker url={ExternalLinks.BOOKING_SYSTEM} text="Check back soon." />
                        </p>
                    )}
                </div>
            </div>

            <InvestErrorModal {...getInvestErrorModalProps()} />
            <RestoreModal {...getRestoreModalProps()} />
        </div>
    );
}
