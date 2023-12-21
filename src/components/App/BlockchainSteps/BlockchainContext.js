import React, {createContext, useContext, useEffect, useState, useMemo} from 'react';
import _ from 'lodash';
import merge from 'lodash/merge';
import {
    getTransaction,
    INTERACTION_TYPE
} from "@/components/App/BlockchainSteps/config";

const DEFAULT_STATE = {
    isClean: true,
    result: {
        network: {},
        liquidity: {},
        allowance: {},
        transaction: {},
    }, //blockchainSummary
    data: {
        userWallet: "",
        transaction: {
            params: {},
            type: INTERACTION_TYPE.NONE,
            prerequisites: false,
            method: {},
            listen: false
        },
        button: {
            customLockState: false,
            customLockText: "",
        }
    }, //processingData
    state: {
        network: {
            isLoading: false,
            isFinished: false,
            isError: false,
            error: false,
            lock: true,
        },
        liquidity: {
            isFetched: false,
            isLoading: false,
            isFinished: false,
            isError: false,
            error: false,
            lock: true,
        },
        allowance: {
            isFetched: false,
            isLoading: false,
            isFinished: false,
            isError: false,
            error: false,
            lock: true,
        },
        transaction: {
            isFetched: false,
            isLoading: false,
            isFinished: false,
            isError: false,
            error: false,
            lock: true,
        },
        button: {
            lock: false,
            text: "",
        }
    },
    steps: {
        network: false,
        liquidity: false,
        allowance: false,
        transaction: false,
        button: false,
    }
}

const BlockchainContext = createContext({
    blockchainProps: DEFAULT_STATE,
    updateBlockchainProps: () => {},
    blockchainCleanup: () => {},
    insertConfiguration: () => {},
    blockchainRunProcess: () => {},
    blockchainRunProcessDirect: () => {},
    stepsIsReady: {
        network: false,
        liquidity: false,
        allowance: false,
        transaction: false,
    },
});

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({children}) => {
    const [blockchainProps, setBlockchainProps] = useState(DEFAULT_STATE);
    const {steps, state, data} = blockchainProps
    const {
        network: checkNetwork,
        liquidity: checkLiquidity,
        allowance: checkAllowance,
        transaction: checkTransaction
    } = steps
    const {
        network: stepNetwork,
        liquidity: stepLiquidity,
        allowance: stepAllowance,
        transaction: stepTransaction,
        button: stepButton
    } = state
    const {transaction: dataTransaction} = data

    const stepsIsReady = useMemo(() => ({
        network: !stepNetwork.lock,
        liquidity: !stepLiquidity.lock && (checkNetwork ? stepNetwork.isFinished : true),
        allowance: !stepAllowance.lock && (checkLiquidity ? stepLiquidity.isFinished : (checkNetwork ? stepNetwork.isFinished : true)),
        transaction: (!stepTransaction.lock && dataTransaction.prerequisites) && (checkAllowance ? stepAllowance.isFinished : (checkLiquidity ? stepLiquidity.isFinished : (checkNetwork ? stepNetwork.isFinished : true)))
    }), [
        stepNetwork.lock,
        stepLiquidity.lock,
        stepAllowance.lock,
        stepTransaction.lock,
        dataTransaction.prerequisites,
        stepNetwork.isFinished,
        stepLiquidity.isFinished,
        stepLiquidity.isFetched,
        stepAllowance.isFinished
    ]);

    const insertConfiguration = (newProps) => {
        setBlockchainProps(_ => {
            const mergedProps = merge({}, DEFAULT_STATE, newProps);
            mergedProps.isClean = false;
            return mergedProps;
        });
    };

    const updateBlockchainProps = (updates) => {
        setBlockchainProps(prevProps => {
            const newState = _.cloneDeep(prevProps);
            updates.forEach(update => {
                _.set(newState, update.path, update.value);
            });
            return newState;
        });
    };

    const blockchainCleanup = () => {
        setBlockchainProps(DEFAULT_STATE)
    }


    useEffect(() => {
        console.log("listen", !data.button?.buttonFn, !dataTransaction.params.listen)
        if(!data.button?.buttonFn || !dataTransaction.params.listen) return;
        const {prerequisites, method} = getTransaction(dataTransaction.type, dataTransaction.params)
        let updates = [{path: 'data.transaction.prerequisites', value: prerequisites}]
        if(prerequisites) {
            updates.push({path: 'data.transaction.method', value: method})
        }
        updateBlockchainProps(updates)
        if(prerequisites) {
            console.log("STARTING PROCESSS")
            blockchainRunProcessDirect()
        }
    }, [
        dataTransaction.params.listen,
        dataTransaction.prerequisites,
        dataTransaction.params.diamond,
        dataTransaction.params.hash,
        dataTransaction.params.price,
        dataTransaction.params.selectedCurrency?.address,
        dataTransaction.params.isSell,
        dataTransaction.params.market,
        dataTransaction.params.otcId,
        dataTransaction.params.dealId,
        dataTransaction.params.signature?.hash,
    ])


    const blockchainRunProcess = () => {
        const {prerequisites, method} = getTransaction(dataTransaction.type, dataTransaction.params)
        let updates = [{path: 'data.transaction.prerequisites', value: prerequisites}]
        if(prerequisites) {
            updates.push({path: 'data.transaction.method', value: method})
        }
        updateBlockchainProps(updates)
        blockchainRunProcessDirect()
    }


    const blockchainRunProcessDirect = () => {
        if (stepButton.lock) return;
        let enable = []
        if (checkNetwork) {
            enable.push({path: 'state.network.lock', value: false})
        }
        if (checkLiquidity) {
            enable.push({path: 'state.liquidity.lock', value: false})
        }
        if (checkAllowance) {
            enable.push({path: 'state.allowance.lock', value: false})
        }
        if (checkTransaction) {
            enable.push({path: 'state.transaction.lock', value: false})
        }
        updateBlockchainProps(enable);
    }

    const value = {
        blockchainProps,
        stepsIsReady,
        updateBlockchainProps,
        blockchainCleanup,
        insertConfiguration,
        blockchainRunProcessDirect,
        blockchainRunProcess
    };

    return (
        <BlockchainContext.Provider value={value}>
            {children}
        </BlockchainContext.Provider>
    );
};
