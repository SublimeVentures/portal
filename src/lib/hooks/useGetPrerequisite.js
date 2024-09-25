import { useEffect, useState } from "react";
import { getMethod, getPrerequisite, METHOD } from "@/components/BlockchainSteps/utils";

const DEFAULT_STATE = {
    isError: false,
    error: null,
    method: {},
    extra: null,
    isLoading: false,
};

function useGetPrerequisite(isEnabled, params, globalState, token) {
    const [state, setState] = useState(DEFAULT_STATE);

    const updateState = (newState) => {
        setState((prevState) => {
            return { ...prevState, ...newState };
        });
    };

    useEffect(() => {
        if (isEnabled && !globalState.prerequisite.isFinished) {
            updateState({ isLoading: true });
            console.log(`BIX :: AVECO PREREQUISITE - SET - should run: ${isEnabled}`);

            getPrerequisite(params.transactionType, { ...params, globalState })
                .then((result) => {
                    console.log(`BIX :: AVECO PREREQUISITE - SET - results for ${params.transactionType}`, result);
                    if (result.ok) {
                        const transaction_method = getMethod(params.transactionType, token, {
                            ...params,
                            prerequisite: result.data,
                        });
                        console.log(`BIX :: AVECO PREREQUISITE - SET - transaction method`, transaction_method);

                        updateState({
                            isLoading: false,
                            method: transaction_method.method || null,
                            extra: result?.data || null,
                            isFinished: transaction_method?.ok || false,
                            error: transaction_method.error,
                            isError: !!transaction_method.error,
                        });
                    } else {
                        updateState({
                            isLoading: false,
                            method: null,
                            extra: null,
                            isFinished: false,
                            error: result.error,
                        });
                    }
                })
                .catch((error) => {
                    updateState({
                        isLoading: false,
                        method: null,
                        extra: null,
                        isFinished: false,
                        error: error?.shortMessage || error,
                        isError: true,
                    });
                });
        }
        if (!isEnabled) {
            updateState({
                isLoading: false,
                method: null,
                extra: null,
                isFinished: false,
            });
        }
    }, [isEnabled]);

    return state;
}

export default useGetPrerequisite;
