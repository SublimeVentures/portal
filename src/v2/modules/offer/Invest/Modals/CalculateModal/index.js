import { BsCalculator } from "react-icons/bs";

import { IconButton } from "@/v2/components/ui/icon-button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";
import CalculateForm from "./CalculateForm";

export default function CalculateModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <IconButton className="p-0" icon={BsCalculator} />
            </DialogTrigger>

            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Profit Calculator</DialogTitle>
                </DialogHeader>

               <CalculateForm /> 

                <DialogFooter className="flex items-center">
                  <p className="max-w-72 text-sm font-regular text-green-500 text-center">Usual multiplier for seed investment is between 20-50x.</p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

            // <RestoreHashModal
            //     restoreModalProps={restoreModalProps}
            //     model={isRestoreModal.open}
            //     setter={() => {
            //         setRestoreModal({ open: false, amount: 0 });
            //     }}
            // />
            // <ErrorModal
            //     errorModalProps={errorModalProps}
            //     model={isErrorModal.open}
            //     setter={() => {
            //         setErrorModal({ open: false, code: null });
            //     }}
            // />
            // {network?.isSupported && selectedCurrency && (
            //     <InvestModal
            //         investModalProps={investModalProps}
            //         model={isInvestModal}
            //         setter={() => {
            //             setInvestModal(false);
            //         }}
            //     />
            // )}