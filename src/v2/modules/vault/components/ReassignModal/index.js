import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";

export default function ReassignModal(props) {
    const { open, onOpenChange } = props;
    const { account, activeInvestContract } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const { data: offer } = useOfferDetailsQuery();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="md:items-center">
                    <DialogTitle>{transactionSuccessful ? "Investment successful" : "Allocation Reassign"}</DialogTitle>
                    <DialogDescription className="max-w-80 md:text-center">
                        You have want to reassign allocation in{" "}
                        <span className="text-green-500 uppercase">{offer.name}</span>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
