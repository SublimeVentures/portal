import React, {createContext, useContext, useEffect, useState, useMemo} from 'react';
import _ from 'lodash';
import merge from 'lodash/merge';

const DEFAULT_STEP_STATE = {
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
        prerequisite: {},
        network: {},
        liquidity: {},
        allowance: {},
        transaction: {},
    }, //blockchainSummary
    data: {
        userWallet: "",
        prerequisite: {},
        transaction: {
            type: 0,
            params: {},
            ready: false,
            method: {},
        },
        button: {
            customLockState: false,
            customLockText: "",
        }
    },
    state: {
        prerequisite: { ...DEFAULT_STEP_STATE },
        network: { ...DEFAULT_STEP_STATE },
        liquidity: { ...DEFAULT_STEP_STATE },
        allowance: { ...DEFAULT_STEP_STATE },
        transaction: { ...DEFAULT_STEP_STATE },
        button: {
            lock: false,
            text: "",
        }
    },
    steps: {
        prerequisite: false,
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
    stepsIsReady: {
        prerequisite: false,
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
        prerequisite: checkPrerequisite,
        network: checkNetwork,
        liquidity: checkLiquidity,
        allowance: checkAllowance,
        transaction: checkTransaction
    } = steps
    const {
        prerequisite: stepPrerequisite,
        network: stepNetwork,
        liquidity: stepLiquidity,
        allowance: stepAllowance,
        transaction: stepTransaction,
        button: stepButton
    } = state
    const {transaction: dataTransaction} = data

    const stepsIsReady = useMemo(() => ({
        prerequisite: !stepPrerequisite.lock,
        network: !stepNetwork.lock && (checkPrerequisite ? stepPrerequisite.isFinished : true),
        liquidity: !stepLiquidity.lock && (checkNetwork ? stepNetwork.isFinished : (checkPrerequisite ? stepPrerequisite.isFinished : true)),
        allowance: !stepAllowance.lock && (checkLiquidity ? stepLiquidity.isFinished : (checkNetwork ? stepNetwork.isFinished : (checkPrerequisite ? stepPrerequisite.isFinished : true))),
        transaction: (!stepTransaction.lock && dataTransaction.ready) && (checkAllowance ? stepAllowance.isFinished : (checkLiquidity ? stepLiquidity.isFinished : (checkNetwork ? stepNetwork.isFinished : (checkPrerequisite ? stepPrerequisite.isFinished : true)))),
    }), [
        stepPrerequisite.lock,
        stepNetwork.lock,
        stepLiquidity.lock,
        stepAllowance.lock,
        stepTransaction.lock,
        stepPrerequisite.isFinished,
        stepNetwork.isFinished,
        stepLiquidity.isFinished,
        stepLiquidity.isFetched,
        stepAllowance.isFinished,
        dataTransaction.ready,
        checkPrerequisite,
        checkNetwork,
        checkLiquidity,
        checkAllowance
    ]);

    console.log("IQZ :: context",stepsIsReady, blockchainProps)

    const insertConfiguration = (newProps) => {
        setBlockchainProps(_ => {
            const mergedProps = merge({}, DEFAULT_STATE, newProps);
            mergedProps.isClean = false;
            mergedProps.state.button.text = mergedProps.data.button.text;
            mergedProps.state.button.lock = mergedProps.data.button.customLockState;
            console.log("mergedProps",mergedProps)
            return mergedProps;
        });
    };

    const updateBlockchainProps = (updates, source) => {
        setBlockchainProps(prevProps => {
            const newState = _.cloneDeep(prevProps);
            updates.forEach(update => {
                _.set(newState, update.path, update.value);
                // console.log("update.path",update.path, source)
            });
            // console.log("Before update - source:", source, "Prev State:", prevProps, source);
            console.log("Updates:", updates, source);
            // console.log("After update - New State:", newState, source);
            // console.log("UPDATES -", source, updates, newState, source)

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
        if (checkPrerequisite) {
            enable.push({path: 'state.prerequisite.lock', value: false})
        }
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
        updateBlockchainProps(enable, "button start");
    }

    const value = {
        DEFAULT_STEP_STATE,
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
