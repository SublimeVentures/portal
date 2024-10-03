import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import useMarket from "@/v2/modules/otc/logic/useMarket";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { queryClient } from "@/lib/queryCache";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import useGetToken from "@/lib/hooks/useGetToken";
import { getUserAllocation } from "@/v2/fetchers/otc";
import { millisecondsInHour } from "@/constants/datetime";

export const TABS = Object.freeze({ BUY: 0, SELL: 1 });
export const DEFAULT_VALUES = Object.freeze({ MULTIPLIER: 1, MIN_ALLOCATION: 10, MAX_PRICE: 1000000 });

export default function useCreateOfferModalLogic(isModalOpen, setIsModalOpen) {
    const { currentMarket } = useMarket();
    const { cdn, account, activeOtcContract, getCurrencySettlement } = useEnvironmentContext();
    const { getExpireData, setExpireData } = useLocalStorage();

    const { data: vault, refetch: refetchVault } = useQuery({
        queryKey: ["userAllocation"],
        queryFn: getUserAllocation,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 3 * 60 * 1000,
    });

    const [selectedTab, setSelectedTab] = useState(TABS.BUY);
    const dropdownCurrencyOptions = getCurrencySettlement();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const [multiplier, setMultiplier] = useState(DEFAULT_VALUES.MULTIPLIER);

    const amountStorageKey = `otc.${currentMarket?.offerId}.amount`;
    const priceStorageKey = `otc.${currentMarket?.offerId}.price`;
    const currencyStorageKey = `otc.${currentMarket?.offerId}.currency`;

    const multiplierParsed = multiplier.toFixed(2);
    const isSeller = selectedTab === TABS.SELL;
    const textCopy = isSeller ? "sell" : "buy";
    const userAllocation = vault && currentMarket ? vault.find((el) => el.offerId === currentMarket.offerId) : null;
    const allocationMax = userAllocation?.allocation;

    const formSchema = z.object({
        currency: z.string(),
        amount: z
            .number()
            .min(DEFAULT_VALUES.MIN_ALLOCATION, { message: `Minimum amount: ${DEFAULT_VALUES.MIN_ALLOCATION}` })
            .max(isSeller ? allocationMax : DEFAULT_VALUES.MAX_PRICE, {
                message: `Maximum amount: ${isSeller ? allocationMax : DEFAULT_VALUES.MAX_PRICE}`,
            })
            .refine((val) => val % 10 === 0, { message: "Amount has to be divisible by 10" }),
        price: z
            .number()
            .min(DEFAULT_VALUES.MIN_ALLOCATION, { message: `Price must be at least ${DEFAULT_VALUES.MIN_ALLOCATION}` })
            .max(DEFAULT_VALUES.MAX_PRICE, { message: `Price must be at most ${DEFAULT_VALUES.MAX_PRICE}` }),
    });

    const { setValue, watch, reset, clearErrors, ...form } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        onSubmit: (values) => console.log("Submit:", values),
        defaultValues: {
            amount: getExpireData(amountStorageKey) ?? 10,
            price: getExpireData(priceStorageKey) ?? 10,
            currency: "",
        },
    });

    const statusCheck = !form.formState.isValid;
    const [amount, price, currency] = watch(["amount", "price", "currency"]);
    const selectedCurrency = dropdownCurrencyOptions.find((c) => c.symbol === currency);

    const calcMulti = useCallback(
        (price_) => setMultiplier(Number(Number(price_) / Number(amount).toFixed(2))),
        [amount],
    );

    const calcPrice = useCallback(
        (multiplier, amount) => {
            const newPrice = Number(Number(amount * multiplier).toFixed(2));

            setExpireData(priceStorageKey, newPrice, new Date().getTime() + millisecondsInHour);
            setValue("price", newPrice);
        },
        [setExpireData, priceStorageKey, setValue],
    );

    const handleAmountChange = useCallback(
        (evt, callback) => {
            const amount = +evt.target.value;
            setExpireData(amountStorageKey, amount, new Date().getTime() + millisecondsInHour);
            if (amount) calcPrice(multiplier, amount);

            if (callback) return callback(amount);
        },
        [setExpireData, amountStorageKey, calcPrice, multiplier],
    );

    const handlePriceChange = useCallback(
        (evt, callback) => {
            const price = +evt.target.value;
            setExpireData(priceStorageKey, price, new Date().getTime() + millisecondsInHour);
            if (price && amount) calcMulti(price);

            if (callback) return callback(price);
        },
        [setExpireData, priceStorageKey, calcMulti, amount],
    );

    const handleCurrencyChange = useCallback(
        (currency, callback) => {
            setExpireData(currencyStorageKey, currency, new Date().getTime() + millisecondsInHour);

            return callback(currency);
        },
        [setExpireData, currencyStorageKey],
    );

    const handleSetMaxValue = useCallback(
        (event, callback) => {
            if (userAllocation) {
                const { invested, locked } = userAllocation;
                const newAmount = Number(invested) - Number(locked);
                if (newAmount) {
                    setValue("amount", newAmount);
                    handleAmountChange({ target: { value: invested - locked } }, callback);
                }
            }
        },
        [handleAmountChange, setValue, userAllocation],
    );

    const handleSelectTab = useCallback(
        (tabId) => {
            if (allocationMax === 0 && tabId === TABS.SELL) return;
            setSelectedTab(tabId);
        },
        [allocationMax],
    );

    useEffect(() => {
        const closeModal = async () => {
            await Promise.all([refetchVault(), queryClient.invalidateQueries(["otcOffers"])]);

            reset();
            setMultiplier(DEFAULT_VALUES.MULTIPLIER);
            setTransactionSuccessful(false);

            setIsModalOpen(false);
        };

        if (!isModalOpen) closeModal();
    }, [isModalOpen]);

    useEffect(() => {
        const cachedCurrency = getExpireData(currencyStorageKey);
        const value = cachedCurrency || dropdownCurrencyOptions[0].symbol || "";
        const isValidCurrency = value && value !== "...";

        if (!currency & isValidCurrency) {
            setValue("currency", value);
        }
    }, [dropdownCurrencyOptions]);

    const customLocks = () => {
        if (statusCheck) return { lock: true, text: "Bad parameters" };
        else return { lock: false };
    };

    useEffect(() => {
        if (isSeller && amount > allocationMax) {
            const data = getExpireData(amountStorageKey) || allocationMax;
            setExpireData(amountStorageKey, data, new Date().getTime() + millisecondsInHour);
            setValue("amount", data);
            if (data) calcPrice(multiplier, data);
        }
    }, [isSeller]);

    const { lock, text } = customLocks();
    const token = useGetToken(selectedCurrency?.contract);

    const blockchainInteractionDataBUY = useMemo(() => {
        console.log("BIX :: BUTTON STATE locked - refresh");
        return {
            steps: {
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                price: Number(price),
                liquidity: Number(price),
                allowance: Number(price),
                amount: Number(amount),
                account: account.address,
                spender: activeOtcContract,
                contract: activeOtcContract,
                buttonCustomText: text,
                buttonCustomLock: lock,
                buttonText: "Make Offer",
                market: currentMarket,
                isSeller: false,
                prerequisiteTextWaiting: "Generate hash",
                prerequisiteTextProcessing: "Generating hash",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Couldn't generate hash",
                transactionType: METHOD.OTC_MAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [selectedCurrency?.contract, price, amount, token, account, activeOtcContract, isModalOpen, text]);

    const blockchainInteractionDataSELL = useMemo(() => {
        console.log("BIX :: BUTTON STATE locked - refresh");
        return {
            steps: {
                transaction: true,
            },
            params: {
                price: Number(price),
                amount: Number(amount),
                account: account.address,
                spender: activeOtcContract,
                contract: activeOtcContract,
                buttonCustomText: text,
                buttonCustomLock: lock,
                buttonText: "Make Offer",
                market: currentMarket,
                isSeller: true,
                transactionType: METHOD.OTC_MAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [selectedCurrency?.contract, price, amount, token, account, activeOtcContract, isModalOpen, text]);

    const getOfferFieldProps = useCallback(
        (name) => {
            const fields = {
                amount: {
                    name,
                    control: form.control,
                    handleChange: handleAmountChange,
                    placeholder: "Offer amount",
                    label: "Your offer ",
                },
                price: {
                    name,
                    control: form.control,
                    handleChange: handlePriceChange,
                    placeholder: "Desired amount",
                    label: "You price",
                },
                currency: {
                    name,
                    value: currency,
                    control: form.control,
                    handleChange: handleCurrencyChange,
                    placeholder: null,
                    label: null,
                    options: dropdownCurrencyOptions,
                },
                ...(isSeller
                    ? {
                          max: {
                              name,
                              control: form.control,
                              handleChange: handleSetMaxValue,
                          },
                      }
                    : {}),
            };

            return fields[name];
        },
        [form, handleSetMaxValue, handleCurrencyChange, handleAmountChange, isSeller],
    );

    return {
        transactionSuccessful,
        currentMarket,
        textCopy,
        amount,
        selectedTab,
        blockchainInteractionDataSELL,
        blockchainInteractionDataBUY,
        getSelectedMarketProps: useCallback(
            () => ({
                name: currentMarket.name,
                ticker: currentMarket.ticker,
                slug: currentMarket.slug,
                cdn,
            }),
            [currentMarket.name, currentMarket.ticker, currentMarket.slug, cdn],
        ),
        getOfferTabsProps: useCallback(
            () => ({
                allocationMax,
                selectedTab,
                handleSelectTab,
            }),
            [allocationMax, selectedTab, handleSelectTab],
        ),
        getOfferFormProps: useCallback(
            () => ({
                form,
                cdn,
                multiplierParsed,
                market: { name: currentMarket.name, slug: currentMarket.slug },
                getOfferFieldProps,
            }),
            [form, cdn, multiplierParsed, currentMarket.name, currentMarket.slug, getOfferFieldProps],
        ),
    };
}
