import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { stakingPeriodOptions } from "./utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useGetToken from "@/lib/hooks/useGetToken";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import { METHOD } from "@/v2/components/BlockchainSteps/utils";
import { settingsKeys } from "@/v2/constants";

const stakingCurrency = {
    chainId: 84532,
    contract: "0xBcf4b6EaD5e44A1FbcF58f8F55906d88290bC1c6",
    isSettlement: true,
    isStaking: true,
    isStore: false,
    name: "Based",
    precision: 18,
    symbol: "BASED",
};

export default function useSingeSidedStaking({ isOpen, userId }) {
    const { account, activeDiamond } = useEnvironmentContext();

    const { watch, setValue, setError, clearErrors, handleSubmit, formState, ...form } = useForm({
        mode: "onChange",
        defaultValues: {
            based: 0,
            period: "360 days",
        },
    });

    const stakeBased = watch("based");

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    useEffect(() => {
        if (transactionSuccessful) {
            refreshSession();
        }
    }, [transactionSuccessful]);

    const { data: wallets } = useQuery({
        queryKey: settingsKeys.userWallets(userId),
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    const registeredOriginalWallet = wallets?.find((el) => el.isHolder)?.wallet;

    const wallet =
        registeredOriginalWallet === account.address
            ? "0x0000000000000000000000000000000000000000"
            : registeredOriginalWallet;

    const token = useGetToken(stakingCurrency?.contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: stakingCurrency?.chainId,
                account: account.address,
                liquidity: stakeBased,
                allowance: stakeBased,
                buttonText: "Stake",
                contract: activeDiamond,
                spender: activeDiamond,
                delegated: wallet,
                transactionType: METHOD.STAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond, stakeBased, isOpen]);

    const blockchainStep = useBlockchainStep({
        data: blockchainInteractionData,
        deps: [isOpen],
    });

    return {
        ...blockchainStep,
        transactionSuccessful,
        form,
    };
}
