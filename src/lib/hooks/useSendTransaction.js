import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";

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

function useSendTransaction(isEnabled, method, chainId, account) {
    if (method?.stop) {
        return true;
    }
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

    const scope = `${account}_trans_${contract}_${name}_${chainId}_${!!inputs ? inputs[1] || inputs[0] : "temp"}`;

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

    const simulate = useSimulateContract({
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
        isError: simulate.isError || write.isError || confirm.isError,
        error: processError(simulate.error, write.error, confirm.error),
        // error: simulate.error?.shortMessage || write.error?.shortMessage || confirm.error?.shortMessage,
        isLoading:
            simulate.isFetching ||
            write.isFetching ||
            confirm.isFetching ||
            simulate.isLoading ||
            write.isLoading ||
            confirm.isLoading ||
            write.isPending,
        // isLoading: simulate.isFetching || write.isFetching || confirm.isFetching ||  simulate.isLoading || write.isLoading || confirm.isLoading || confirm.isPending || write.isPending,
        simulate,
        write,
        confirm,
        rando,
    };
}

export default useSendTransaction;
