import { useCallback, useState } from "react";
import { useContractRead } from "wagmi";
import abi_reassign from "../../../../../../abi/ReasignFacet.abi.json";

export default function useReassign(session) {
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [chosenCurrency, setChosenCurrency] = useState(false);
    const closeReassignModal = useCallback(() => setIsReassignModalOpen(false), []);

    const openReassignModal = useCallback(() => setIsReassignModalOpen(true), []);

    const useGetReassignPrice = (diamond) => {
        const { data, error, isLoading } = useContractRead({
            address: diamond,
            abi: abi_reassign,
            functionName: "getReassignPrice",
        });

        return { data, error, isLoading };
    };

    return {
        getReassignModalProps: () => ({
            open: isReassignModalOpen,
            onOpenChange: setIsReassignModalOpen,
            handleCurrencyChange: setChosenCurrency,
            currency: chosenCurrency,
            openModal: openReassignModal,
            closeModal: closeReassignModal,
            useGetReassignPrice,
        }),
    };
}
