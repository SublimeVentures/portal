import { BsCalculator } from "react-icons/bs";

import CalculateForm from "./CalculateForm";
import { IconButton } from "@/v2/components/ui/icon-button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";

export default function CalculateModal({ taxPercentage }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <IconButton className="p-0" icon={BsCalculator} aria-label="Profit calculator" />
            </DialogTrigger>

            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Profit Calculator</DialogTitle>
                </DialogHeader>

                <CalculateForm fee={taxPercentage} />

                <DialogFooter className="flex items-center">
                    <p className="max-w-64 text-xs font-regular text-green-500 text-center md:max-w-72 md:text-sm">
                        Usual multiplier for seed investment is between 20-50x.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
