import React, {createContext, useContext, useState, useEffect} from 'react';
import _ from 'lodash';
import merge from 'lodash/merge';
import {useAccount, useSwitchChain} from "wagmi";
import {TENANT} from "@/lib/tenantHelper";
import {logOut} from "@/fetchers/auth.fetcher";
import routes from "@/routes";
import {useRouter} from "next/router";

const DEFAULT_STATE = {
    isClean: true,
    cdn: "",
    otcFee: 50,
    walletGuard: true,
    network: {
        name: "",
    },
    account: {
        isConnected: false,
        address: "",
    },
    diamonds: {},
    currencies: [],
    currencySettlement: [],
    currencyStore: [],
    otcContracts: {},

    activeDiamond: "",
    activeChainCurrency: {},
    activeChainSettlementSymbol: [],
    activeChainStoreSymbol: [],
    activeChainStakingSymbol: [],
}

const EnvironmentContext = createContext({
    environmentProps: DEFAULT_STATE,
    getCurrencySymbolByAddress: () => {
    },
    environmentCleanup: () => {
    },
    insertEnvironment: () => {
    },
    updateEnvironmentProps: () => {
    },
});

export const useEnvironmentContext = () => useContext(EnvironmentContext);

export const EnvironmentProvider = ({children, initialData}) => {
    const router = useRouter();
    const [environmentProps, setEnvironmentProps] = useState(DEFAULT_STATE);
    const {network: networkProp, account: accountProp, diamonds, currencies, otcContracts} = environmentProps

    const {isConnected: accountIsConnected, address: accountAddress, chain} = useAccount()

    const {
        error: networkError,
        isLoading: networkIsLoading,
        isPending: networkIsPending,
        chains,
        switchChain
    } = useSwitchChain()

    console.log("NETWOR_SWITCH", networkIsLoading, networkIsPending)

    useEffect(() => {
        console.log("EC :: context pass init",environmentProps.isClean && initialData?.cdn, environmentProps.isClean, !!initialData?.cdn, initialData, environmentProps)
        if (environmentProps.isClean && initialData?.cdn) {
            updateEnvironmentProps([
                {path: 'diamonds', value: initialData.diamonds},
                {path: 'currencies', value: initialData.currencies},
                {path: 'otcContracts', value: initialData.otcContracts},
                {path: 'otcFee', value: initialData.otcFee},
                {path: 'cdn', value: initialData.cdn},
                {path: 'isClean', value: false},
            ], "saved environment")
        }
    }, [initialData?.cdn])


    useEffect(() => {
        const isNetworkSupported = !!chains.find(el => el.id === chain?.id)

        const activeChainCurrency = {};
        const currencySettlementSymbol = [];
        const currencyStoreSymbol = [];
        const currencySettlement = [];
        const currencyStore = [];
        for (const currency of currencies) {
            if (currency.chainId === chain?.id) {
                activeChainCurrency[currency.symbol] = {
                    name: currency.name,
                    symbol: currency.symbol,
                    precision: currency.precision,
                    isSettlement: currency.isSettlement,
                    chainId: currency.chainId,
                    address: currency.address
                };

                if (currency.isSettlement) {
                    currencySettlementSymbol.push(currency.symbol)
                    currencySettlement.push({
                        name: currency.name,
                        symbol: currency.symbol,
                        precision: currency.precision,
                        isSettlement: currency.isSettlement,
                        chainId: currency.chainId,
                        address: currency.address
                    });
                }
                if (currency.isStore || Number(process.env.NEXT_PUBLIC_TENANT) === TENANT.basedVC) {
                    currencyStoreSymbol.push(currency.symbol)
                    currencyStore.push({
                        name: currency.name,
                        symbol: currency.symbol,
                        precision: currency.precision,
                        isSettlement: currency.isSettlement,
                        chainId: currency.chainId,
                        address: currency.address
                    });
                }
            }
        }

        updateEnvironmentProps([
            {path: 'network.isSupported', value: isNetworkSupported},
            {path: 'network.chainId', value: chain?.id},
            {path: 'network.chains', value: chains},
            {path: 'network.name', value: chain?.name},
            {path: 'network.error', value: networkError},
            {path: 'network.isLoading', value: networkIsPending},
            {path: 'account.isConnected', value: accountIsConnected},
            {path: 'account.address', value: accountAddress},
            {path: 'activeDiamond', value: diamonds[chain?.id ? chain.id : 1]},
            {path: 'activeOtcContract', value: otcContracts[chain?.id ? chain.id : 1]},

            {path: 'activeChainCurrency', value: activeChainCurrency},
            {path: 'activeChainSettlementSymbol', value: currencySettlementSymbol},
            {path: 'activeChainStoreSymbol', value: currencyStoreSymbol},
            {path: 'currencySettlement', value: currencySettlement},
            {path: 'currencyStore', value: currencyStore},

        ], "set network and account environment")
    }, [
        networkError, networkIsPending, chain?.id,
        accountIsConnected, accountAddress, environmentProps.isClean,
        initialData?.cdn
    ])


    const getCurrencySymbolByAddress = (address) => {
        return currencies.find(el => el.address == address)?.symbol
    }

    const insertEnvironment = (newProps) => {
        setEnvironmentProps(_ => {
            const mergedProps = merge({}, DEFAULT_STATE, newProps);
            mergedProps.isClean = false;
            console.log("EC :: ENVIRONMENT", mergedProps)
            return mergedProps;
        });
    };

    const updateEnvironmentProps = (updates, source) => {
        setEnvironmentProps(prevProps => {
            const newState = _.cloneDeep(prevProps);
            updates.forEach(update => {
                _.set(newState, update.path, update.value);
            });
            console.log("EC :: update props:", newState, source);

            return newState;
        });
    };

    const environmentCleanup = () => {
            router.push(routes.Landing).then(async (el) => {
                setEnvironmentProps(DEFAULT_STATE)
                await logOut()
            })
    }

    const value = {
        network: {
            ...networkProp,
            switchChain,
        },
        walletGuard: environmentProps.walletGuard,
        otcFee: environmentProps.otcFee,
        cdn: environmentProps.cdn,
        account: accountProp,
        activeDiamond: environmentProps.activeDiamond,
        activeOtcContract: environmentProps.activeOtcContract,
        currencies: environmentProps.currencies,
        activeChainCurrency: environmentProps.activeChainCurrency,
        activeChainSettlementSymbol: environmentProps.activeChainSettlementSymbol,
        activeChainStoreSymbol: environmentProps.activeChainStoreSymbol,
        activeChainStakingSymbol: environmentProps.activeChainStakingSymbol,
        getCurrencySymbolByAddress,
        environmentCleanup,
        insertEnvironment,
        updateEnvironmentProps,
    };

    return (
        <EnvironmentContext.Provider value={value}>
            {children}
        </EnvironmentContext.Provider>
    );
};
