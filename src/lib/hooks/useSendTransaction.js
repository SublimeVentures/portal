import {
    useSimulateContract,
    useWaitForTransactionReceipt,
    useWriteContract,
    usePublicClient,
    useConfig,
    useEstimateFeesPerGas,
} from "wagmi";
import { useEffect } from "react";
import { estimateContractGas } from "viem/actions";
import { useQuery } from "@tanstack/react-query";

function processError(...errors) {
    for (const error of errors) {
        if (error && error.shortMessage && error.shortMessage.includes("reason:\n")) {
            // Extract the reason after "reason:\n" if found
            return extractReason(error.shortMessage);
        }
    }
    // If "reason:\n" is not found in any error, return the original message
    return errors[0]?.shortMessage || errors[1]?.shortMessage || errors[2]?.shortMessage;
}

function extractReason(errorMessage) {
    const index = errorMessage.indexOf("reason:\n");
    if (index !== -1) {
        const reason = errorMessage.substring(index + "reason:\n".length).trim();
        return reason;
    }
    return null;
}

const useEstimateContractGas = (args) => {
    const { query, functionName, address, abi, scopeKey } = args;
    const enabled = Boolean(abi && address && functionName && (query.enabled ?? true));
    const config = useConfig(args);
    const client = usePublicClient(config);
    const data = useQuery({
        queryKey: ["estimateContractGas", scopeKey],
        queryFn: () => estimateContractGas(client, args),
        ...query,
        enabled,
    });
    return data;
};

const calculateBigIntMultiplier = (value, multiplier) => {
    if (!value) {
        return value;
    }
    if (multiplier <= 1) {
        return value;
    }
    return BigInt(Math.floor(Number(value) * multiplier));
};

const GAS_MULTIPLIER = 1;
const MAX_FEE_PER_GAS_MULTIPLIER = 1.5;
const MAX_PRIORITY_FEE_PER_GAS_MULTIPLIER = 10;

const useCalculateGas = (args) => {
    const { query = {}, ...params } = args;
    const { chainId, scopeKey } = params;

    const gas = useEstimateContractGas({
        ...params,
        scopeKey: `gas_${scopeKey}`,
        query: {
            gcTime: 0,
            ...query,
        },
    });

    const feesPerGas = useEstimateFeesPerGas({
        chainId,
        scopeKey: `fees_${scopeKey}`,
        query: {
            gcTime: 0,
            ...query,
        },
    });

    return {
        isFetching: gas.isFetching || feesPerGas.isFetching,
        isSuccess: gas.isSuccess && feesPerGas.isSuccess,
        isLoading: gas.isLoading || feesPerGas.isLoading,
        isFetched: gas.isFetched && feesPerGas.isFetched,
        isError: gas.isError || feesPerGas.isError,
        error: processError(gas.error, feesPerGas.error),
        data: {
            gas: calculateBigIntMultiplier(gas?.data, GAS_MULTIPLIER),
            maxFeePerGas: calculateBigIntMultiplier(feesPerGas?.data?.maxFeePerGas, MAX_FEE_PER_GAS_MULTIPLIER),
            maxPriorityFeePerGas: calculateBigIntMultiplier(
                feesPerGas?.data?.maxPriorityFeePerGas,
                MAX_PRIORITY_FEE_PER_GAS_MULTIPLIER,
            ),
        },
    };
};

function useSendTransaction(isEnabled, method, chainId, account) {
    if (method?.stop ?? false) return true;

    if (!method) {
        method = {
            name: "",
            inputs: "",
            contract: "",
            abi: "",
            confirmations: "",
        };
    }

    const { name, inputs, contract, abi, confirmations } = method;

    const scope = `${account}_trans_${contract}_${name}_${chainId}_${inputs ? inputs[1] || inputs[0] : "temp"}`;

    const rando = {
        method,
        functionName: name,
        address: contract,
        args: inputs,
        abi: abi,
        chainId: chainId,
        scopeKey: scope,
        account: account,
        query: {
            enabled: isEnabled,
        },
    };

    const gas = useCalculateGas({
        functionName: name,
        address: contract,
        args: inputs,
        abi: abi,
        chainId: chainId,
        scopeKey: scope,
        account: account,
        query: {
            enabled: isEnabled,
        },
    });

    const simulate = useSimulateContract({
        functionName: name,
        address: contract,
        args: inputs,
        abi: abi,
        chainId: chainId,
        scopeKey: scope,
        account: account,
        gas: gas?.data?.gas,
        maxFeePerGas: gas?.data?.maxFeePerGas,
        maxPriorityFeePerGas: gas?.data?.maxPriorityFeePerGas,
        query: {
            enabled: isEnabled && gas.isSuccess,
            gcTime: 0,
        },
    });

    const write = useWriteContract();
    const confirmEnabled = write.isSuccess;

    const confirm = useWaitForTransactionReceipt({
        confirmations: confirmations,
        hash: write?.data,
        query: {
            enabled: confirmEnabled,
        },
    });

    console.log(
        `useSendTransaction - render ${inputs ? inputs : "tempSend"}`,
        isEnabled,
        simulate.isSuccess,
        !write.isPending,
        !confirm?.data,
    );

    useEffect(() => {
        console.log(
            `useSendTransaction - trigger ${inputs ? inputs : "temp"}`,
            simulate.isSuccess,
            !write.isPending,
            !confirm?.isLoading,
            !confirm?.isPending,
            !confirm.isFetching,
            isEnabled,
        );
        if (simulate.isSuccess && !write.isPending && !(confirm.isLoading || confirm.isFetching) && isEnabled) {
            write.writeContract(simulate.data?.request);
        }
    }, [simulate.isSuccess, isEnabled]);

    return {
        isError: simulate.isError || write.isError || confirm.isError || gas.isError,
        error: simulate.error?.shortMessage || write.error?.shortMessage || confirm.error?.shortMessage || gas?.error,
        isLoading:
            simulate.isFetching ||
            write.isFetching ||
            confirm.isFetching ||
            simulate.isLoading ||
            write.isLoading ||
            confirm.isLoading ||
            write.isPending,
        simulate,
        write,
        confirm,
        rando,
    };
}

export default useSendTransaction;
