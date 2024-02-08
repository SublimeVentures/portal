import React, {createContext, useContext, useState, useEffect} from 'react';
import {useCookies} from "react-cookie";

const DEFAULT_STATE = {
    code: 0,
    expires: 0,
    amount: 0,
    signature: "",
}

const InvestContext = createContext({
    getSavedBooking: () => {
    },
    clearBooking: () => {
    },
    setBooking: () => {
    },
});

export const useInvestContext = () => useContext(InvestContext);

export const InvestProvider = ({children, initialData}) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [bookingDetails, setBookingDetails] = useState(DEFAULT_STATE)
    const [offerId, setOfferId] = useState(0)



    useEffect(() => {
        console.log("IE :: LOAD")
        const cookie = cookies[`hash_${initialData}`];
        console.log("IE :: LOAD", cookie)

        if(!!cookie) {

            setBookingDetails({
                code: cookie.code,
                expires: Number(cookie.expires),
                amount: Number(cookie.amount),
                signature: cookie.signature,
            });
            console.log("IE :: savedCookie", cookie)

        }
        console.log("IE :: initialData",initialData)
        setOfferId(initialData)

    }, [initialData])


    const setBooking = (booking) => {
        const expires = Number(booking.expires)
        const obj = {
            code: booking.hash,
            expires: expires,
            amount: Number(booking.amount),
            signature: booking.signature,
        }
        setBookingDetails(obj)
        setCookie(`hash_${offerId}`, `${JSON.stringify(obj)}`, {expires: new Date(expires * 1000)})
    }

    const clearBooking = () => {
        const removedCookieContent = cookies[`hash_${offerId}`];
        console.log("clean", bookingDetails, removedCookieContent)
        removeCookie(`hash_${offerId}`, { path: '/app/offer' });
        setBookingDetails(DEFAULT_STATE)
    }


    const getSavedBooking = () => {
        const saved = cookies[`hash_${offerId}`]
        return !!saved ? {ok:true, ...saved} : {ok:false}
    }


    const value = {
        bookingDetails,
        setBooking,
        clearBooking,
        getSavedBooking,
    };

    return (
        <InvestContext.Provider value={value}>
            {children}
        </InvestContext.Provider>
    );
};
