import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { buttonInvestState, tooltipInvestState, userInvestmentState } from "@/lib/investment";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { Button } from "@/v2/components/ui/button";
import { useOfferDetailsQuery, useOfferAllocationQuery, useUserAllocationQuery } from "../queries";

import InvestForm from "./InvestForm";
import { getInvestSchema } from "./utils";

// @TODO Reuse with fundraise component
const Definition = ({ term, isLoading, children }) => (
    <>
        <dt>{term}:</dt>
        <dd className="text-right justify-self-end font-medium">
            {isLoading ? <Skeleton className="w-8" /> : children}
        </dd>
    </>
);

// @TODO - Move session to Zustand
export default function Invest({ session }) {
    const { network, getCurrencySettlement } = useEnvironmentContext();
    const dropdownCurrencyOptions = getCurrencySettlement();
    const { getExpireData } = useLocalStorage();
    
    const { data: offer } = useOfferDetailsQuery();
    const { data: allocation } = useOfferAllocationQuery();
    const { data: userAllocation } = useUserAllocationQuery();
    const { allocationData, upgradesUse } = useOfferDetailsStore();
    const { phaseCurrent } = usePhaseInvestment();
    
    const [investButtonState, setInvestButtonState] = useState({ isDisabled: false, text: "" });

    const { watch, setValue, setError, clearErrors, ...form } = useForm({
        resolver: zodResolver(getInvestSchema(allocationData)),
        mode: "onChange",
        defaultValues: {
            investmentAmount: 0,
            currency: dropdownCurrencyOptions?.[0] ?? "USDT",
        },
    });

    const investmentAmount = watch("investmentAmount");

    const isBooked = allocationData.offer_isProcessing && allocationData.allocationUser_guaranteed === 0;
    const isStakeLock = session?.stakingEnabled ? !session.isStaked : false;
    const investmentLocked = investButtonState.isDisabled || isStakeLock;

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

    const amountStorageKey = `offer.${offer.id}.amount`;
    const currencyStorageKey = `offer.${offer.id}.currency`;

    useEffect(() => {
        const cachedData = getExpireData(amountStorageKey);
        const value = cachedData ?? allocationData?.allocationUser_min ?? offer.alloMin;

        setValue("investmentAmount", value);;
        clearErrors();
    }, [allocationData?.allocationUser_min]);

    useEffect(() => {
        const cachedCurrency = getExpireData(currencyStorageKey);
        const initialCurrency = cachedCurrency || dropdownCurrencyOptions[0];

        setValue("currency", initialCurrency.symbol);
    }, [network?.chainId, dropdownCurrencyOptions]);
    
    // @TODO - Tax amount depends of tier - logic not ready yet.
    const tax = 10;
    const subtotal = investmentAmount - (investmentAmount * (tax / 100));

    return (
        <div className="relative flex flex-col flex-1 justify-center items-center">
            <div className="w-full flex flex-col space-y-6 lg:p-4 2xl:p-8">
                <h3 className="mb-6 text-base lg:text-xl">My Contribution</h3>
                <InvestForm allocationData={allocationData} {...{ watch, setValue, setError, clearErrors, ...form }} />

                <dl className="grid grid-cols-2 gap-2 md:gap-3 text-sm md:text-base">
                    <Definition term="Subtotal">${subtotal}</Definition>
                    <Definition term="Tax fees">{tax}%</Definition>
                </dl>

                <div class="w-full h-[1px] bg-foreground/10"></div>

                <div className="grid grid-rows-3 items-center justify-center text-sm text-center lg:grid-cols-2 lg:grid-rows-1 lg:text-start">
                    <h4 className="text-sm md:text-base lg:col-start-1">Total Investment:</h4>
                    <div className="font-semibold text-3xl lg:col-start-2 lg:row-span-2 lg:text-end">${investmentAmount}</div>
                    <p className="text-sm font-regular text-foreground/40 lg:col-start-1">Tax fees don't contribute to deals</p>
                </div>

                <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                    <Button 
                        variant="gradient" 
                        disabled={investButtonState.isDisabled || investmentLocked} 
                        className="flex-grow basis-full sm:basis-auto"
                        // onClick={handler={debouncedMakeInvestment}}
                    >
                        {investButtonState.text}
                    </Button>
                    {investmentLocked && userAllocation?.invested.total - userAllocation?.invested.invested > 0 && (
                        <Button 
                            variant="gradient" 
                            disabled={investButtonState.isDisabled} 
                            className="flex-grow basis-full sm:basis-auto"
                            // handler={debouncedMakeInvestment}
                        >
                            Restore
                        </Button>
                    )}
                </div>
                
                {isBooked && (
                    <p className="text-sm text-green-500 text-center">
                        All spots booked! Awaiting blockchain confirmations. <br />
                        {/* <Linker url={ExternalLinks.BOOKING_SYSTEM} text={"Check back soon."} /> */}
                    </p>
                )}
            </div>
        </div>
    );
};
