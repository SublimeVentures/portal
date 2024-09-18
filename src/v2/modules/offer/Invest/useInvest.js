import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";

import { queryClient } from "@/lib/queryCache";
import { buttonInvestState, tooltipInvestState } from "@/lib/investment";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { fetchHash } from "@/fetchers/invest.fetcher";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";

import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import { useOfferDetailsQuery, useOfferAllocationQuery, useUserAllocationQuery } from "@/v2/modules/offer/queries";
import useInvestContext from "../useInvestContext";
import { getInvestSchema } from "./utils";
import { millisecondsInHour } from "@/constants/datetime";

// import { useEffect, useState, Fragment, useCallback } from "react";
// import { Transition } from "@headlessui/react";
// import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
// import { ButtonIconSize } from "@/components/Button/RoundButton";
// import "@leenguyen/react-flip-clock-countdown/dist/index.css";
// import { PhaseId } from "@/lib/phases";
// import ErrorModal from "@/components/App/Offer/ErrorModal";
// import UpgradesModal from "@/components/App/Offer/UpgradesModal";
// import InvestModal from "@/components/App/Offer/InvestModal";
// import RestoreHashModal from "@/components/App/Offer/RestoreHashModal";
// import CalculateModal from "@/components/App/Offer/CalculateModal";
// import Dropdown from "@/components/App/Dropdown";
// import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
// import { checkIfNumberKey, tenantIndex } from "@/lib/utils";
// import { IconButton } from "@/components/Button/IconButton";
// import { Tooltiper, TooltipType } from "@/components/Tooltip";
// import { buttonInvestState, tooltipInvestState, userInvestmentState } from "@/lib/investment";
// import Linker from "@/components/link";

// import DynamicIcon from "@/components/Icon";
// import { ICONS } from "@/lib/icons";
// import { useInvestContext } from "@/components/App/Offer/InvestContext";
// import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
// import useLocalStorage from "@/lib/hooks/useLocalStorage";


// export default function useInvest(investmentAmount, currency, isStakeLock) {
//   const { network, getCurrencySettlement } = useEnvironmentContext();    
//   const { clearBooking, bookingDetails, setBooking, getSavedBooking } = useInvestContext();
//   const { data: userAllocation } = useUserAllocationQuery();
//   const { offerId, allocationData, upgradesUse } = useOfferDetailsStore();
//   const dropdownCurrencyOptions = getCurrencySettlement();
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);


//     const openInvestmentModal = () => {
//         if (isStakeLock) {
//             return;
//         }
//         setInvestModal(true);
//     };
    

// @TODO - Tax amount depends of tier - logic not ready yet.
export default function useInvest(session) {
    const { network, getCurrencySettlement } = useEnvironmentContext();    
    const dropdownCurrencyOptions = getCurrencySettlement();
    const { phaseCurrent } = usePhaseInvestment();
    
    const { clearBooking, bookingDetails, setBooking, getSavedBooking } = useInvestContext();
    const { getExpireData, setExpireData } = useLocalStorage();
    
    const { data: offer } = useOfferDetailsQuery();
    const { data: allocation } = useOfferAllocationQuery();
    const { data: userAllocation } = useUserAllocationQuery();
    const { offerId, allocationData, upgradesUse } = useOfferDetailsStore();

    const [investButtonState, setInvestButtonState] = useState({ isDisabled: false, text: "" });
    const [errorModalState, setErrorModalState] = useState({ open: false, code: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
    const [isRestoreModalOpen, setIsResotreModalOpen] = useState(false);

    const { watch, setValue, setError, clearErrors, handleSubmit, ...form } = useForm({
        resolver: zodResolver(getInvestSchema(allocationData, dropdownCurrencyOptions)),
        mode: "onChange",
        defaultValues: {
            investmentAmount: 0,
            currency: "",
        },
    });

    const investmentAmount = watch("investmentAmount");
    const currency = watch("currency");
    
    const amountStorageKey = `offer.${offer.id}.amount`;
    const currencyStorageKey = `offer.${offer.id}.currency`;
    
    const isBooked = allocationData.offer_isProcessing && allocationData.allocationUser_guaranteed === 0;
    const isStakeLock = session?.stakingEnabled ? !session.isStaked : false;
    const investmentLocked = investButtonState.isDisabled || isStakeLock;
    const hasAvailableFunds = (userAllocation?.invested.total - userAllocation?.invested.invested) > 0;
    const tax = 10;
    const subtotal = investmentAmount - (investmentAmount * (tax / 100));
    
    useEffect(() => {
        const cachedData = getExpireData(amountStorageKey);
        const value = cachedData ?? allocationData?.allocationUser_min ?? offer.alloMin;
    
        setValue("investmentAmount", value);;
        clearErrors();
    }, [allocationData?.allocationUser_min]);
    
    useEffect(() => {
        const cachedCurrency = getExpireData(currencyStorageKey);
    
        const value = cachedCurrency || dropdownCurrencyOptions[0].symbol || "";
        const isValidCurrency = value && value !== "...";
    
        if (!currency & isValidCurrency) {
            setValue("currency", value);
        }
    }, [dropdownCurrencyOptions]);

    useEffect(() => {
        if (!offer) return;
    
        const { allocation: allocationIsValid, message } = tooltipInvestState(offer, allocationData, investmentAmount);
    
        if (!allocationIsValid) {
            setError("investmentAmount", { type: "manual", message: message ?? "Invalid allocation amount" });
        }
        
        const { isDisabled, text } = buttonInvestState(
            allocation || {},
            phaseCurrent,
            investmentAmount,
            allocationIsValid,
            allocationData,
            isStakeLock,
            userAllocation?.invested
        );
    
        setInvestButtonState({ isDisabled, text })
    }, [
        allocationData,
        investmentAmount,
        allocation?.alloFilled,
        allocation?.alloRes,
        upgradesUse?.increasedUsed?.amount,
        upgradesUse?.guaranteedUsed?.amount,
        upgradesUse?.guaranteedUsed?.alloUsed,
        userAllocation?.invested?.total,
        phaseCurrent?.phase,
    ]);
    
    const handleSetStorageData = (key, data) => setExpireData(key, data, new Date().getTime() + millisecondsInHour);

    const handleCurrencyChange = (value, callback) => {
        handleSetStorageData(currencyStorageKey, value);
        callback(value);
    };

    const handleAmountChange = (value, callback, args = []) => {
        handleSetStorageData(amountStorageKey, value);
        callback(...args);
    };

    const startInvestmentProcess = async (values) => {
        const { investmentAmount, currency } = values;         
        const isValidInvestment = (
            investmentAmount > 0 && 
            allocationData.allocationUser_max > 0 && 
            allocationData.allocationUser_min > 0 && 
            allocationData.allocationUser_left > 0 && 
            investmentAmount <= allocationData.allocationUser_left
        );

        const hasRemainingInvestment = (userAllocation?.invested.total - userAllocation?.invested.invested) > 0;

        if (isValidInvestment || hasRemainingInvestment) {
            setIsLoading(true);
            const contract = dropdownCurrencyOptions.find(option => option.symbol === currency)?.contract;

            const res = await fetchHash(offerId, investmentAmount, contract, network.chainId);
            console.log('res-2', res)
            
            if (!res.ok) {
                await clearBooking();
                setErrorModalState({ open: true, code: res.code });
                queryClient.invalidateQueries(["userAllocation"]);
            };


            // } else if (response.hash?.length > 5) {
            //     const confirmedAmount = Number(response.amount);
            //     setValue(confirmedAmount);
            //     setBooking(response);
            //     openInvestmentModal();
            // }

            // const response = await fetchHash(offer.id, investmentAmount, selectedCurrency?.contract, network.chainId);
            //     if (!response.ok) {
            //         await clearBooking();
            //         setErrorModal({ open: true, code: response.code });
            //         refetchOfferAllocation();
            //     } else if (response.hash?.length > 5) {
            //         const confirmedAmount = Number(response.amount);
            //         setValue(confirmedAmount);
            //         setBooking(response);
            //         openInvestmentModal();
            //     }

            setIsLoading(false);
        };
    };

    const processExistingSession = async (values) => {
        setIsLoading(true);
        console.log('processExistingSession', values)

        // try {
        //     const savedTimestamp = bookingDetails.expires;
        //     const savedAmount = bookingDetails.amount;
        //     if (savedTimestamp < moment.utc().unix()) {
        //         clearBooking();
        //         await startInvestmentProcess();
        //     } else if (savedAmount === Number(investmentAmount)) {
        //         openInvestmentModal();
        //     } else {
        //         console.log("restore ", savedAmount);
        //         setRestoreModal({
        //             open: true,
        //             amount: savedAmount,
        //         });
        //     }
        // } catch (e) {
        //     await clearBooking();
        //     await startInvestmentProcess();
        // }

        setIsLoading(false);
    };

    const makeInvestment = async (values, eventName) => {
        const { ok } = getSavedBooking();
              
        if (ok) await processExistingSession(values);
        else await startInvestmentProcess(values);
    };

    const debouncedSubmitHandler = debounce(makeInvestment, 5000, { leading: true, trailing: false });

    const onSubmit = (values, evt) => {
        const eventName = evt.nativeEvent.submitter.name; // invest / restore
        debouncedSubmitHandler(values, eventName);
    };

    return {
        isBooked,
        getInvestFormProps: () => ({
            form: { ...form, watch, setValue, setError, clearErrors },
            onSubmit: handleSubmit(onSubmit),
        }),
        getInvestFormFieldsProps: () => ({
            amount: investmentAmount,
            handleCurrencyChange,
            handleAmountChange,
        }),
        getInvestFormSummaryProps: () => ({
            total: investmentAmount,
            currency,
            subtotal,
            tax,
        }),
        getInvestFormSubmitProps: () => ({
            disabled: investButtonState.isDisabled,
            btnText: investButtonState.text,
            investmentLocked,
            hasAvailableFunds,
        }),
        getInvestErrorModalProps: () => ({
            code: errorModalState.code,
            open: errorModalState.open,
            onOpenChange: () => setErrorModalState(prevState => ({ open: !prevState.open, code: "" })),
        }),
    };
};

//     const openInvestmentModal = () => {
//         if (isStakeLock) {
//             return;
//         }
//         setInvestModal(true);
//     };

//     const startInvestmentProcess = async () => {
//         const isValidInvestment = (
//             investmentAmount > 0 && 
//             allocationData.allocationUser_max > 0 && 
//             allocationData.allocationUser_min > 0 && 
//             allocationData.allocationUser_left > 0 && 
//             investmentAmount <= allocationData.allocationUser_left
//         );

//         const hasRemainingInvestment = (userAllocation?.invested.total - userAllocation?.invested.invested) > 0;

//         if (isValidInvestment || hasRemainingInvestment) {
//             setIsLoading(true);

//             console.log('res-1', offerId, investmentAmount, contract, network.chainId)
//             const res = await fetchHash(offerId, investmentAmount, contract, network.chainId);
//             console.log('res-2', res)

//             // const response = await fetchHash(offer.id, investmentAmount, selectedCurrency?.contract, network.chainId);
//             //     if (!response.ok) {
//             //         await clearBooking();
//             //         setErrorModal({ open: true, code: response.code });
//             //         refetchOfferAllocation();
//             //     } else if (response.hash?.length > 5) {
//             //         const confirmedAmount = Number(response.amount);
//             //         setValue(confirmedAmount);
//             //         setBooking(response);
//             //         openInvestmentModal();
//             //     }

//             setIsLoading(false);
//         };
//     };

//     const processExistingSession = async () => {
//         setIsLoading(true);

//         console.log('processExistingSession')

//         // try {
//         //     const savedTimestamp = bookingDetails.expires;
//         //     const savedAmount = bookingDetails.amount;
//         //     if (savedTimestamp < moment.utc().unix()) {
//         //         clearBooking();
//         //         await startInvestmentProcess();
//         //     } else if (savedAmount === Number(investmentAmount)) {
//         //         openInvestmentModal();
//         //     } else {
//         //         console.log("restore ", savedAmount);
//         //         setRestoreModal({
//         //             open: true,
//         //             amount: savedAmount,
//         //         });
//         //     }
//         // } catch (e) {
//         //     await clearBooking();
//         //     await startInvestmentProcess();
//         // }

//         setIsLoading(false);
//     };
    
