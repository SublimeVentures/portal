import { useCallback, useState } from "react";
import { useContractRead } from "wagmi";
import { useForm } from "react-hook-form";
import abi_reassign from "../../../../../../abi/ReasignFacet.abi.json";
import { reassignOfferAllocation } from "@/v2/fetchers/reassign.fetcher";

export default function useReassign(data, chainId, dropdownCurrencyOptions) {
    const { offerId } = data;

    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [to, setTo] = useState(null);
    const [chosenCurrency, setChosenCurrency] = useState(false);

    const closeReassignModal = useCallback(() => setIsReassignModalOpen(false), []);

    const openReassignModal = useCallback(() => setIsReassignModalOpen(true), []);

    const form = useForm();

    const isDisabled = !chosenCurrency;

    const chosenCurrencyAddress = dropdownCurrencyOptions.find((option) => option.symbol === chosenCurrency)?.contract;

    const useGetReassignPrice = (diamond) => {
        const { data, error, isLoading } = useContractRead({
            address: diamond,
            abi: abi_reassign,
            functionName: "getReassignPrice",
        });

        return { data, error, isLoading };
    };

    const onSubmit = useCallback(async () => {}, []);

    return {
        inputs: { offerId, currency: chosenCurrencyAddress, to },
        getReassignFormProps: () => ({
            form,
            handleSubmit: form.handleSubmit(onSubmit),
            loading,
            setLoading,
            error,
            setError,
            isDisabled,
        }),
        getReassignModalProps: () => ({
            open: isReassignModalOpen,
            onOpenChange: setIsReassignModalOpen,
            handleCurrencyChange: setChosenCurrency,
            handleAddressChange: setTo,
            currency: chosenCurrency,
            openModal: openReassignModal,
            closeModal: closeReassignModal,
            useGetReassignPrice,
        }),
    };
}
