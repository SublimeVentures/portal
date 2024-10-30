import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import moment from "moment";

import useInvestContext from "../useInvestContext";
import { getInvestSchema } from "./utils";
import { queryClient } from "@/lib/queryCache";
import { buttonInvestState } from "@/lib/investment";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { fetchHash } from "@/fetchers/invest.fetcher";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";

import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import { useOfferDetailsQuery, useOfferAllocationQuery, useUserAllocationQuery } from "@/v2/modules/offer/queries";
import { millisecondsInHour } from "@/constants/datetime";
import { offersKeys, userInvestmentsKeys } from "@/v2/constants";

export default function useInvest(session) {
    const { network, getCurrencySettlement } = useEnvironmentContext();
    const dropdownCurrencyOptions = getCurrencySettlement();
    const { phaseCurrent } = usePhaseInvestment();

    const { getSavedBooking, setBooking, clearBooking } = useInvestContext();
    const { getExpireData, setExpireData } = useLocalStorage();

    const { data: offer } = useOfferDetailsQuery();
    const { data: allocation } = useOfferAllocationQuery();
    const { data: userAllocation } = useUserAllocationQuery();
    const { offerId, allocationData } = useOfferDetailsStore();

    const [errorModalState, setErrorModalState] = useState({ open: false, code: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
    const [restoreModalData, setRestoreModalData] = useState({ open: false, amount: 0, date: null });

    const { watch, setValue, setError, clearErrors, handleSubmit, formState, ...form } = useForm({
        resolver: zodResolver(getInvestSchema(allocationData, dropdownCurrencyOptions)),
        mode: "onChange",
        defaultValues: {
            investmentAmount: 0,
            currency: "",
        },
    });

    const investmentAmount = watch("investmentAmount");
    const currency = watch("currency");
    const hasErrors = Object.keys(formState.errors).length > 0;

    const amountStorageKey = `offer.${offer.id}.amount`;
    const currencyStorageKey = `offer.${offer.id}.currency`;

    const isBooked = allocationData.offer_isProcessing && allocationData.allocationUser_guaranteed === 0;
    const isStakeLock = session?.stakingEnabled ? !session.isStaked : false;
    const { isBtnDisabled, btnText } = buttonInvestState(
        allocation || {},
        phaseCurrent,
        investmentAmount,
        !hasErrors,
        allocationData,
        isStakeLock,
    );

    const investmentLocked = isBtnDisabled || isStakeLock;
    const hasAvailableFunds = userAllocation?.invested.total - userAllocation?.invested.invested > 0;
    const subtotal = investmentAmount - investmentAmount * (session.tier.fee / 100);

    useEffect(() => {
        const cachedData = getExpireData(amountStorageKey);
        const value = cachedData ?? allocationData?.allocationUser_min ?? offer.alloMin;

        setValue("investmentAmount", value);
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

    const handleSetStorageData = (key, data) => setExpireData(key, data, new Date().getTime() + millisecondsInHour);

    const handleCurrencyChange = (value, callback) => {
        handleSetStorageData(currencyStorageKey, value);
        callback(value);
    };

    const handleAmountChange = (value, callback, args = []) => {
        handleSetStorageData(amountStorageKey, value);
        callback(...args);
    };

    const openInvestmentModal = () => {
        if (isStakeLock) return;

        queryClient.invalidateQueries(offersKeys.offerParticipants()), setIsInvestModalOpen(true);
    };

    const bookingRestore = async () => {
        const booking = getSavedBooking();
        const { amount, time } = booking || {};

        setRestoreModalData({ open: false, amount, time });
        setValue("investmentAmount", amount);
        openInvestmentModal();
    };

    const bookingCreateNew = async (newValue) => {
        setIsLoading(true);
        setRestoreModalData({ open: false, amount: 0, time: null });
        clearBooking();
        await startInvestmentProcess({ investmentAmount: newValue, currency });
    };

    const afterInvestmentCleanup = async () => {
        setIsLoading(true);
        clearBooking();

        await Promise.all([
            queryClient.invalidateQueries(userInvestmentsKeys.userAllocation()),
            queryClient.invalidateQueries(offersKeys.offerAllocation()),
            queryClient.invalidateQueries(offersKeys.offerParticipants()),
            queryClient.invalidateQueries(offersKeys.offerDetails()),
        ]);

        setIsLoading(false);
    };

    const bookingExpire = async () => {
        setRestoreModalData({ open: false, amount: 0, time: null });
        setIsInvestModalOpen(false);
        await afterInvestmentCleanup();
    };

    const startInvestmentProcess = async (values) => {
        const { investmentAmount, currency } = values;
        const isValidInvestment =
            investmentAmount > 0 &&
            allocationData.allocationUser_max > 0 &&
            allocationData.allocationUser_min > 0 &&
            allocationData.allocationUser_left > 0 &&
            investmentAmount <= allocationData.allocationUser_left;

        const hasRemainingInvestment = userAllocation?.invested.total - userAllocation?.invested.invested > 0;

        if (isValidInvestment || hasRemainingInvestment) {
            if (!isLoading) setIsLoading(true);

            const contract = dropdownCurrencyOptions.find((option) => option.symbol === currency)?.contract;

            const res = await fetchHash(offerId, investmentAmount, session.tier.fee, contract, network.chainId);

            if (!res.ok) {
                await clearBooking();
                setErrorModalState({ open: true, code: res.code });
                queryClient.invalidateQueries(userInvestmentsKeys.userAllocation());
            } else if (res.hash?.length > 5) {
                const confirmedAmount = Number(res.amount);
                setValue("investmentAmount", confirmedAmount);
                setBooking(res);
                openInvestmentModal();
            }
        }

        setIsLoading(false);
    };

    const processExistingSession = async (values) => {
        setIsLoading(true);

        try {
            const bookingDetails = getSavedBooking();
            const savedTimestamp = bookingDetails.expires;
            const savedDate = bookingDetails.date;
            const savedAmount = bookingDetails.amount;

            if (savedTimestamp < moment.utc().unix()) {
                clearBooking();
                await startInvestmentProcess(values);
            } else if (savedAmount === Number(investmentAmount)) {
                openInvestmentModal();
            } else {
                setRestoreModalData({ open: true, amount: savedAmount, date: savedDate });
            }
        } catch (e) {
            await clearBooking();
            await startInvestmentProcess(values);
        }

        setIsLoading(false);
    };

    const makeInvestment = async (values) => {
        const rest = getSavedBooking();

        if (rest.ok) await processExistingSession(values);
        else await startInvestmentProcess(values);
    };

    const debouncedSubmitHandler = debounce(makeInvestment, 5000, { leading: true, trailing: false });

    const onSubmit = (values) => debouncedSubmitHandler(values);

    return {
        isBooked,
        getInvestFormProps: () => ({
            form: { ...form, formState, watch, setValue, setError, clearErrors },
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
            fee: session.tier.fee,
        }),
        getInvestFormSubmitProps: () => ({
            isBtnDisabled,
            btnText,
            investmentLocked,
            hasAvailableFunds,
        }),
        getInvestModalProps: () => ({
            open: isInvestModalOpen,
            investmentAmount,
            currency,
            onOpenChange: setIsInvestModalOpen,
            handleCurrencyChange,
            bookingExpire,
            afterInvestmentCleanup,
        }),
        getRestoreModalProps: () => ({
            open: restoreModalData.open,
            allocationOld: restoreModalData.amount,
            timeOld: restoreModalData.time,
            investmentAmount,
            bookingCreateNew,
            bookingRestore,
            onOpenChange: () => setRestoreModalData((prevState) => ({ ...prevState, open: !prevState.open })),
        }),
        getInvestErrorModalProps: () => ({
            code: errorModalState.code,
            open: errorModalState.open,
            onOpenChange: () => setErrorModalState((prevState) => ({ open: !prevState.open, code: null })),
        }),
    };
}
