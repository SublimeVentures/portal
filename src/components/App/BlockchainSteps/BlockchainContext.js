import React, {createContext, useContext, useEffect, useState} from 'react';
import merge from 'lodash/merge';

const BlockchainContext = createContext({
    blockchainProps: {
        processingData: {},
        buttonData: {},
        checkLiquidity: false,
        checkTransaction: false,
        showButton: false,
        saveData: false,
    },
    updateBlockchainProps: () => {}, // Dummy function as placeholder
});

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [blockchainProps, setBlockchainProps] = useState({
        processingData: {},
        buttonData: {},
        checkLiquidity: false,
        checkTransaction: false,
        showButton: false,
        saveData: false,
    });

    //SUMMARY
    const [blockchainSummary, setBlockchainSummary] = useState({});


    //BUTTON
    const [buttonLock, setButtonLock] = useState(false)
    const [buttonText, setButtonText] = useState("")


    //NETWORK
    const [network_isLoading, setNetwork_isLoading] = useState(false)
    const [network_isFinished, setNetwork_isFinished] = useState(false)
    const [network_isError, setNetwork_isError] = useState(false)
    const [network_error, setNetwork_error] = useState(null)
    const [network_result, setNetwork_result] = useState(0)
    const [network_lock, setNetwork_lock] = useState(true)
    const network_isReady = !network_lock


    //LIQUIDITY
    const [liquidity_isFetched, setLiquidity_isFetched] = useState(false)
    const [liquidity_isLoading, setLiquidity_isLoading] = useState(false)
    const [liquidity_isFinished, setLiquidity_isFinished] = useState(false)
    const [liquidity_isError, setLiquidity_isError] = useState(false)
    const [liquidity_error, setLiquidity_error] = useState(null)
    const [liquidity_result, setLiquidity_result] = useState(0) //todo: to saveData
    const [liquidity_lock, setLiquidity_lock] = useState(true)
    const liquidity_isReady = !liquidity_lock && (blockchainProps?.checkNetwork ? network_isFinished : true)


    //ALLOWANCE
    const [allowance_isFetched, setAllowance_isFetched] = useState(false)
    const [allowance_isLoading, setAllowance_isLoading] = useState(false)
    const [allowance_isFinished, setAllowance_isFinished] = useState(false)
    const [allowance_isError, setAllowance_isError] = useState(false)
    const [allowance_error, setAllowance_error] = useState(null)
    const [allowance_result, setAllowance_result] = useState(0) //todo: to saveData
    const [allowance_lock, setAllowance_lock] = useState(true)
    const allowance_isReady = !allowance_lock && (blockchainProps?.checkLiquidity ? liquidity_isFinished : (blockchainProps?.checkNetwork ? network_isFinished : true))


    //TRANSACTION
    const [transaction_isFetched, setTransaction_isFetched] = useState(false)
    const [transaction_isLoading, setTransaction_isLoading] = useState(false)
    const [transaction_isFinished, setTransaction_isFinished] = useState(false)
    const [transaction_isError, setTransaction_isError] = useState(false)
    const [transaction_error, setTransaction_error] = useState(null)
    const [transaction_result, setTransaction_result] = useState(0) //todo: to saveData
    const [transaction_lock, setTransaction_lock] = useState(true)
    const transaction_isReady = !transaction_lock &&  (blockchainProps?.checkAllowance ? allowance_isFinished : (blockchainProps?.checkLiquidity ? liquidity_isFinished : (blockchainProps?.checkNetwork ? network_isFinished : true)))

    const updateBlockchainProps = (newProps) => {
        setBlockchainProps(prevProps => merge({}, prevProps, newProps));
    };

    const blockchainCleanup = () => {
        setNetwork_isLoading(false)
        setNetwork_isFinished(false)
        setNetwork_isError(false)
        setNetwork_error(null)
        setNetwork_result(0)
        setNetwork_lock(true)

        setLiquidity_isFetched(false)
        setLiquidity_isLoading(false)
        setLiquidity_isFinished(false)
        setLiquidity_isError(false)
        setLiquidity_error(null)
        setLiquidity_result(0)
        setLiquidity_lock(true)

        setAllowance_isFetched(false)
        setAllowance_isLoading(false)
        setAllowance_isFinished(false)
        setAllowance_isError(false)
        setAllowance_error(null)
        setAllowance_result(0)
        setAllowance_lock(true)

        setTransaction_isFetched(false)
        setTransaction_isLoading(false)
        setTransaction_isFinished(false)
        setTransaction_isError(false)
        setTransaction_error(null)
        setTransaction_result(0)
        setTransaction_lock(true)

        setBlockchainSummary({})
    }

    useEffect(() => {
        if (blockchainProps.saveData) {
            setBlockchainSummary(prevProps => merge({}, prevProps, {
                network_result,
                liquidity_result,
                allowance_result,
                transaction_result,
                buttonLock,
                buttonText
            }));
        }
    }, [
        network_isFinished,
        liquidity_isFinished,
        allowance_isFinished,
        transaction_isFinished,
        buttonLock,
        buttonText,
    ])

    const value = {
        blockchainProps,
        blockchainSummary,
        updateBlockchainProps,
        blockchainCleanup,
        networkState: {
            isReady: network_isReady,
            setIsReady: (state) => {setNetwork_lock(!state)},
            isLoading: network_isLoading,
            setIsLoading: setNetwork_isLoading,
            result: network_result,
            setResult: setNetwork_result,
            isFinished: network_isFinished,
            setIsFinished: setNetwork_isFinished,
            isError: network_isError,
            setIsError: setNetwork_isError,
            error: network_error,
            setError: setNetwork_error,
            setLock: setNetwork_lock
        },
        liquidityState: {
            isReady: liquidity_isReady,
            isFetched: liquidity_isFetched,
            setIsFetched: setLiquidity_isFetched,
            isLoading: liquidity_isLoading,
            setIsLoading: setLiquidity_isLoading,
            result: liquidity_result,
            setResult: setLiquidity_result,
            isFinished: liquidity_isFinished,
            setIsFinished: setLiquidity_isFinished,
            isError: liquidity_isError,
            setIsError: setLiquidity_isError,
            error: liquidity_error,
            setError: setLiquidity_error,
            setLock: setLiquidity_lock
        },
        allowanceState: {
            isReady: allowance_isReady,
            setIsReady: (state) => {setAllowance_lock(!state)},
            isFetched: allowance_isFetched,
            setIsFetched: setAllowance_isFetched,
            isLoading: allowance_isLoading,
            setIsLoading: setAllowance_isLoading,
            result: allowance_result,
            setResult: setAllowance_result,
            isFinished: allowance_isFinished,
            setIsFinished: setAllowance_isFinished,
            isError: allowance_isError,
            setIsError: setAllowance_isError,
            error: allowance_error,
            setError: setAllowance_error,
            setLock: setAllowance_lock
        },
        transactionState: {
            isReady: transaction_isReady,
            setIsReady: (state) => {setTransaction_lock(!state)},
            isFetched: transaction_isFetched,
            setIsFetched: setTransaction_isFetched,
            isLoading: transaction_isLoading,
            setIsLoading: setTransaction_isLoading,
            result: transaction_result,
            setResult: setTransaction_result,
            isFinished: transaction_isFinished,
            setIsFinished: setTransaction_isFinished,
            isError: transaction_isError,
            setIsError: setTransaction_isError,
            error: transaction_error,
            setError: setTransaction_error,
            setLock: setTransaction_lock
        },
        buttonState: {
            buttonLock,
            setButtonLock,
            buttonText,
            setButtonText
        },
    };

    return (
        <BlockchainContext.Provider value={value}>
            {children}
        </BlockchainContext.Provider>
    );
};
