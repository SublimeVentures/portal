import React, {createContext, useContext, useState, useEffect} from 'react';
import _ from 'lodash';
import {useCookies} from "react-cookie";
import {expireBookings, expireHash} from "@/fetchers/invest.fetcher";

const DEFAULT_STATE = {
    code: 0,
    expires: 0,
    amount: 0,
}

const InvestContext = createContext({
    getCurrencySymbolByAddress: () => {
    },
    environmentCleanup: () => {
    },
    insertEnvironment: () => {
    },
    updateEnvironmentProps: () => {
    },
});

export const useInvestContext = () => useContext(InvestContext);

export const InvestProvider = ({children, initialData}) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [hashData, setHashData] = useState(DEFAULT_STATE)
    const [offerId, setOfferId] = useState(0)



    useEffect(() => {
        console.log("IE :: LOAD")
        const savedCookie = cookies[`hash_${initialData}`];
        let savedData = {}

        if(savedCookie) {
            const split = savedCookie.split('_')
            savedData.code = split[0]
            savedData.amount = Number(split[1])
            savedData.expires = Number(split[2])
        }
        console.log("IE :: savedCookie",savedCookie, savedData)
        console.log("IE :: initialData",initialData)


        setOfferId(initialData)
        setHashData((prevHash) => {
            console.log("IE :: setHash - init",{
                ...prevHash, // Copy the previous state
                ...savedData,
            })
            return ({
            ...prevHash, // Copy the previous state
            ...savedData,
        })});
    }, [initialData])


    const setHash = (hash, expires, amount) => {
        setHashData((prevHash) => {
            console.log("IE :: setHash - method",{
                ...prevHash,
                code: hash,
                expires,
                amount
            })
            return ({
            ...prevHash,
            code: hash,
            expires: Number(expires),
            amount: Number(amount)
        })});
        setCookie(`hash_${offerId}`, `${hash}_${amount}_${expires}`, {expires: new Date(expires * 1000)})
    }

    const cleanHash = async (onServer) => {
        const removedCookieContent = cookies[`hash_${offerId}`];
        console.log("clean", hashData, removedCookieContent)
        removeCookie(`hash_${offerId}`, { path: '/app/offer' });
        setHashData(DEFAULT_STATE)
        if(onServer) {
            const split = removedCookieContent.split('_')
            await expireHash(offerId, split[0])
        }
    }

    const clearBookings = async () => {
        await cleanHash()
        await expireBookings(offerId)
    }

    const getCookie = () => {
        return cookies[`hash_${offerId}`]
    }



    const value = {
        setHash,
        hashData,
        cleanHash,
        getCookie,
        clearBookings
    };

    return (
        <InvestContext.Provider value={value}>
            {children}
        </InvestContext.Provider>
    );
};
