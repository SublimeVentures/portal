import React, {createContext, useContext, useState,useEffect, useMemo} from 'react';
import _ from 'lodash';
import merge from 'lodash/merge';
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";

const DEFAULT_STEP_STATE = {
    isFinished: false,
    isLoading: false,
    isFetched: false,
    isError: false,
    error: false,
    lock: true,
}

const DEFAULT_RESULT_STATE = {
    isFinished: false,
    isLoading: false,
    isFetched: false,
    isError: false,
    error: false,
    lock: true,
}

const DEFAULT_STATE = {
    isClean: true,
    result: {
        network: {},
        liquidity: {},
        allowance: {},
        prerequisite: {},
        transaction: {},
    },
    data: {
        account: "",
        requiredNetwork: 1,
        amount: 0,
        allowance:0,
        currency: "",
        currencyDetails: {},
        transactionType: 0,
        transactionReady: false,
        transactionMethod: {},
        buttonCustomLock: false,
        buttonCustomText: "",
        buttonIcon: null,
        dealId:0,
        otcId:0,
        hash:"",
        buttonText:"",
        market: {},
        isSeller: false,
        prerequisiteTextProcessing: "",
        prerequisiteTextError: "",
    },
    state: {
        network: { ...DEFAULT_STEP_STATE },
        liquidity: { ...DEFAULT_STEP_STATE },
        allowance: { ...DEFAULT_STEP_STATE },
        prerequisite: { ...DEFAULT_STEP_STATE },
        transaction: { ...DEFAULT_STEP_STATE },
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
    }
}

const BlockchainContext = createContext({
    blockchainProps: DEFAULT_STATE,
    updateBlockchainProps: () => {},
    blockchainCleanup: () => {},
    insertConfiguration: () => {},
    blockchainRunProcess: () => {},
    stepsIsReady: {
        network: false,
        liquidity: false,
        allowance: false,
        prerequisite: false,
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
        prerequisite: checkPrerequisite,
        transaction: checkTransaction
    } = steps

    const {
        prerequisite: statePrerequisite,
        network: stateNetwork,
        liquidity: stateLiquidity,
        allowance: stateAllowance,
        transaction: stateTransaction,
        button: stepButton
    } = state

    const stepsIsReady = useMemo(() => ({
        network: !stateNetwork.lock,
        liquidity: !stateLiquidity.lock && (checkNetwork ? stateNetwork.isFinished : true),
        allowance: !stateAllowance.lock && (checkLiquidity ? stateLiquidity.isFinished : (checkNetwork ? stateNetwork.isFinished : true)),
        prerequisite: !statePrerequisite.lock && (checkAllowance ? stateAllowance.isFinished : (checkLiquidity ? stateLiquidity.isFinished : (checkNetwork ? stateNetwork.isFinished : true))),
        transaction: (!stateTransaction.lock && data.transactionReady && statePrerequisite.isFinished) && (checkAllowance ? stateAllowance.isFinished : (checkLiquidity ? stateLiquidity.isFinished : (checkNetwork ? stateNetwork.isFinished : true))),
    }), [
        stateNetwork.lock,
        stateNetwork.isFinished,
        stateLiquidity.lock,
        stateLiquidity.isFinished,
        stateLiquidity.isFetched,
        stateAllowance.lock,
        stateAllowance.isFinished,
        statePrerequisite.lock,
        statePrerequisite.isFinished,
        stateTransaction.lock,
        data.transactionReady,
        checkPrerequisite,
        checkNetwork,
        checkLiquidity,
        checkAllowance,
    ]);

    const {activeChainCurrency: currencyOptions, activeDiamond} = useEnvironmentContext();
    const currencyData = currencyOptions[data.currency]
    useEffect(() => {

        updateBlockchainProps([
            {path: 'data.currencyDetails', value: currencyData},
            {path: 'state.liquidity', value: { ...DEFAULT_STEP_STATE }},
            {path: 'state.allowance', value: { ...DEFAULT_STEP_STATE }},
            {path: 'state.prerequisite', value: { ...DEFAULT_STEP_STATE }},
            {path: 'state.transaction', value: { ...DEFAULT_STEP_STATE }},
        ], "liquidty currency change")

    }, [currencyData?.address, ])


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: DIAMOND CHANGED", activeDiamond)

        updateBlockchainProps([
            {path: 'state.allowance', value: { ...DEFAULT_STEP_STATE }},
            {path: 'state.prerequisite', value: { ...DEFAULT_STEP_STATE }},
            {path: 'state.transaction', value: { ...DEFAULT_STEP_STATE }},
        ], "allowance, diamond zrestartowany")
    }, [activeDiamond])



    const insertConfiguration = (newProps) => {
        setBlockchainProps(_ => {
            const mergedProps = merge({}, DEFAULT_STATE, newProps);
            mergedProps.isClean = false;
            mergedProps.state.button.text = mergedProps.data.buttonText;
            mergedProps.state.button.lock = mergedProps.data.buttonCustomLock;
            console.log("mergedProps",mergedProps)
            return mergedProps;
        });
    };

    const updateBlockchainProps = (updates, source) => {
        setBlockchainProps(prevProps => {
            const newState = _.cloneDeep(prevProps);
            updates.forEach(update => {
                _.set(newState, update.path, update.value);
            });
            console.log("Updates:", updates, source);

            return newState;
        });
    };

    const blockchainCleanup = () => {
        setBlockchainProps(DEFAULT_STATE)
    }



    const blockchainRunProcess = () => {
        console.log("IQZ :: UNLOCKS")
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
        enable.push({path: 'state.prerequisite.lock', value: false})
        if (checkTransaction) {
            enable.push({path: 'state.transaction.lock', value: false})
        }
        updateBlockchainProps(enable, "button start");
    }

    const value = {
        DEFAULT_STEP_STATE,
        DEFAULT_RESULT_STATE,
        blockchainProps,
        stepsIsReady,
        updateBlockchainProps,
        blockchainCleanup,
        insertConfiguration,
        blockchainRunProcess
    };

    return (
        <BlockchainContext.Provider value={value}>
            {children}
        </BlockchainContext.Provider>
    );
};
