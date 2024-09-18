import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import moment from "moment";

import { useOfferDetailsQuery } from "./queries";

const DEFAULT_STATE = {
    code: 0,
    expires: 0,
    amount: 0,
    signature: "",
};

export default function useInvestContext() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [bookingDetails, setBookingDetails] = useState(DEFAULT_STATE);
    const [offerId, setOfferId] = useState(0);

    const { data: offer, isLoading, isError } = useOfferDetailsQuery();

    useEffect(() => {
        console.log("IE :: LOAD");
        const cookie = cookies[`hash_${offer.id}`];
        console.log("IE :: LOAD", cookie);

        if (!!cookie && !isLoading && !isError) {
            setBookingDetails({
                code: cookie.code,
                expires: Number(cookie.expires),
                amount: Number(cookie.amount),
                signature: cookie.signature,
            });
            console.log("IE :: savedCookie", cookie);
        }

        console.log("IE :: initialData", offer.id);
        setOfferId(offer.id);
    }, [offer, isLoading, isError]);

    const setBooking = (booking) => {
        const expires = Number(booking.expires);

        // @TODO - Get createdAt timestamp from backend
        const date = moment().unix();

        const obj = {
            code: booking.hash,
            expires,
            date,
            amount: Number(booking.amount),
            signature: booking.signature,
        };

        setBookingDetails(obj);        
        setCookie(`hash_${offerId}`, `${JSON.stringify(obj)}`, { expires: new Date(expires * 1000) });
    };

    // @TODO - Cookies are not being cleared. Try move to zustand
    const clearBooking = () => {
        console.log("clear");
        // console.log("clear");

        // const removedCookieContent = cookies[`hash_${offerId}`];
        // console.log("clean", bookingDetails, removedCookieContent);
        // removeCookie(`hash_${offerId}`, { path: "/app/offer" });
        // setBookingDetails(DEFAULT_STATE);

        // const removedCookieContent = cookies[`hash_${offerId}`];
        // console.log("clean", bookingDetails, removedCookieContent);
    
        // removeCookie(`hash_${offerId}`, { path: "/" }); // Ensuring the path is correct
        // setBookingDetails(() => ({ ...DEFAULT_STATE }));
    };

    const getSavedBooking = () => {
        const saved = cookies[`hash_${offerId}`] ?? null;
        return !!saved ? { ok: true, ...saved } : { ok: false };
    };

    return {
        bookingDetails,
        setBooking,
        clearBooking,
        getSavedBooking,
    };
};
