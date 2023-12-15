import React, { createContext, useContext, useState } from 'react';
import merge from 'lodash/merge';

// Create the context
const BlockchainContext = createContext({
    blockchainProps: {
        processingData: {},
        buttonData: {},
        checkLiquidity: false,
        checkTransaction: false,
        showButton: false,
        saveData: false,
        saveDataFn: () => {},
    },
    updateBlockchainProps: () => {}, // Dummy function as placeholder
});

// Export the custom hook for consuming the context
export const useBlockchainContext = () => useContext(BlockchainContext);

// Define and export the provider component
export const BlockchainProvider = ({ children }) => {
    const [blockchainProps, setBlockchainProps] = useState({
        processingData: {},
        buttonData: {},
        checkLiquidity: false,
        checkTransaction: false,
        showButton: false,
        saveData: false,
        saveDataFn: () => {},
    });

    const updateBlockchainProps = (newProps) => {
        setBlockchainProps(prevProps => merge({}, prevProps, newProps));
    };

    const value = {
        blockchainProps,
        updateBlockchainProps,
    };

    return (
        <BlockchainContext.Provider value={value}>
            {children}
        </BlockchainContext.Provider>
    );
};
