import React, { createContext, useContext, useState, useEffect } from "react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import set from "lodash.set";
import { useAccount, useSwitchChain } from "wagmi";
import { useRouter } from "next/router";
import { TENANT } from "@/lib/tenantHelper";
import { logOut, logOutRefresh } from "@/fetchers/auth.fetcher";
import routes from "@/routes";

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
    currencies: {},
    currencyStaking: [],
    activeCurrencyStaking: {},
    sharedContracts: {},
    settings: {},
    activeDiamond: "",
};

const EnvironmentContext = createContext({
    environmentProps: DEFAULT_STATE,
    environmentCleanup: () => {},
    insertEnvironment: () => {},
    updateEnvironmentProps: () => {},
    getCurrencyStore: () => {},
    getCurrencySettlement: () => {},
    getCurrencySymbolByAddress: () => {},
});

export const useEnvironmentContext = () => useContext(EnvironmentContext);

export const EnvironmentProvider = ({ children, initialData }) => {
    const router = useRouter();
    const [environmentProps, setEnvironmentProps] = useState(DEFAULT_STATE);
    const {
        network: networkProp,
        account: accountProp,
        diamonds,
        currencies,
        sharedContracts,
        currencyStaking,
    } = environmentProps;

    const { isConnected: accountIsConnected, address: accountAddress, chain } = useAccount();

    const {
        error: networkError,
        isLoading: networkIsLoading,
        isPending: networkIsPending,
        chains,
        switchChain,
    } = useSwitchChain();
    const setInitialDate = () => {
        console.log(
            "EC :: context pass init",
            environmentProps.isClean && initialData?.cdn,
            environmentProps.isClean,
            !!initialData?.cdn,
            initialData,
            environmentProps,
        );
        if (environmentProps.isClean && initialData?.cdn) {
            const currencyAvailable = {};
            let currencyStaking = [];

            for (const currency of initialData.currencies) {
                currencyAvailable[currency.contract] = {
                    name: currency.name,
                    symbol: currency.symbol,
                    precision: currency.precision,
                    chainId: currency.chainId,
                    contract: currency.contract,
                    isSettlement: currency.isSettlement,
                    isStore: currency.isStore,
                    isStaking: currency.isStaking,
                };
                if (currency.isStaking) {
                    currencyStaking.push(currencyAvailable[currency.contract]);
                }
            }

            updateEnvironmentProps(
                [
                    { path: "diamonds", value: initialData.diamonds },
                    { path: "currencies", value: currencyAvailable },
                    { path: "currencyStaking", value: currencyStaking },
                    {
                        path: "sharedContracts",
                        value: initialData.sharedContracts,
                    },
                    { path: "otcFee", value: initialData.otcFee },
                    { path: "settings", value: initialData.setup },
                    { path: "cdn", value: initialData.cdn },
                    { path: "isClean", value: false },
                ],
                "saved environment",
            );
        }
    };

    useEffect(() => {
        const isNetworkSupported = !!chains.find((el) => el.id === chain?.id);

        updateEnvironmentProps(
            [
                { path: "network.isSupported", value: isNetworkSupported },
                { path: "network.chainId", value: chain?.id },
                { path: "network.chains", value: chains },
                { path: "network.name", value: chain?.name },
                { path: "network.error", value: networkError },
                { path: "network.isLoading", value: networkIsPending },
                { path: "account.isConnected", value: accountIsConnected },
                { path: "account.address", value: accountAddress },
                {
                    path: "activeDiamond",
                    value: diamonds[chain?.id ? chain.id : 1],
                },
                {
                    path: "activeOtcContract",
                    value: sharedContracts[chain?.id ? chain.id : 1],
                },
                {
                    path: "activeInvestContract",
                    value: sharedContracts[chain?.id ? chain.id : 1],
                },
                {
                    path: "activeCurrencyStaking",
                    value: currencyStaking.find((el) => el.chainId === chain?.id),
                },
            ],
            "set network and account environment",
        );
    }, [
        networkError,
        networkIsPending,
        chain?.id,
        accountIsConnected,
        accountAddress,
        environmentProps.isClean,
        initialData?.cdn,
    ]);

    useEffect(() => {
        const handleLogoutEvent = () => {
            environmentCleanup(true);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("logoutEvent", handleLogoutEvent);
        }

        // Cleanup the event listener on unmount
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("logoutEvent", handleLogoutEvent);
            }
        };
    }, []);

    const getCurrencySettlement = () => {
        if (networkProp.isSupported) {
            return Object.values(currencies).filter(
                (currency) => currency.chainId === networkProp?.chainId && currency.isSettlement,
            );
        } else {
            return [{ symbol: "..." }];
        }
    };

    const getCurrencyStore = () => {
        if (
            Number(process.env.NEXT_PUBLIC_TENANT) === TENANT.basedVC ||
            Number(process.env.NEXT_PUBLIC_TENANT) === TENANT.BAYC
        )
            return getCurrencySettlement();
        if (networkProp.isSupported) {
            const preferred = Object.values(currencies).filter(
                (currency) => currency.chainId === networkProp?.chainId && currency.isStore,
            );
            const fallback = Object.values(currencies).filter((currency) => currency.isStore);
            return preferred.length > 0 ? preferred : fallback;
        } else {
            return [{ symbol: "..." }];
        }
    };

    const getCurrencySymbolByAddress = (address) => {
        return currencies[address]?.symbol;
    };

    const insertEnvironment = (newProps) => {
        setEnvironmentProps((_) => {
            const mergedProps = merge({}, DEFAULT_STATE, newProps);
            mergedProps.isClean = false;
            console.log("EC :: ENVIRONMENT", mergedProps);
            return mergedProps;
        });
    };

    const updateEnvironmentProps = (updates, source) => {
        setEnvironmentProps((prevProps) => {
            const newState = cloneDeep(prevProps);
            updates.forEach((update) => {
                set(newState, update.path, update.value);
            });
            console.log("EC :: update props:", newState, source);
            return newState;
        });
    };

    const environmentCleanup = (softLogout) => {
        router.push(routes.Landing).then(async (el) => {
            setEnvironmentProps(DEFAULT_STATE);
            softLogout ? await logOutRefresh() : await logOut();
        });
    };

    setInitialDate();
    useEffect(setInitialDate, [initialData?.cdn]);

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
        diamonds: environmentProps.diamonds,
        activeOtcContract: environmentProps.activeOtcContract,
        activeInvestContract: environmentProps.activeInvestContract,
        activeCurrencyStaking: environmentProps.activeCurrencyStaking,
        currencies: environmentProps.currencies,
        currencySettlement: environmentProps.currencySettlement,
        currencyStore: environmentProps.currencyStore,
        currencyStaking: environmentProps.currencyStaking,
        settings: environmentProps.settings,
        getCurrencySettlement,
        getCurrencyStore,
        getCurrencySymbolByAddress,
        environmentCleanup,
        insertEnvironment,
        updateEnvironmentProps,
    };

    return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>;
};
