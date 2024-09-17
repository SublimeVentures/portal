import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

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
        const obj = {
            code: booking.hash,
            expires: expires,
            amount: Number(booking.amount),
            signature: booking.signature,
        };
        setBookingDetails(obj);
        setCookie(`hash_${offerId}`, `${JSON.stringify(obj)}`, {
            expires: new Date(expires * 1000),
        });
    };

    const clearBooking = () => {
        const removedCookieContent = cookies[`hash_${offerId}`];
        console.log("clean", bookingDetails, removedCookieContent);
        removeCookie(`hash_${offerId}`, { path: "/app/offer" });
        setBookingDetails(DEFAULT_STATE);
    };

    const getSavedBooking = () => {
        const saved = cookies[`hash_${offerId}`];
        return saved ? { ok: true, ...saved } : { ok: false };
    };

    return {
        bookingDetails,
        setBooking,
        clearBooking,
        getSavedBooking,
    };
}

// const InvestContext = createContext({
//     getSavedBooking: () => {},
//     clearBooking: () => {},
//     setBooking: () => {},
// });

// export const useInvestContext = () => useContext(InvestContext);

// const value = {
// bookingDetails,
// setBooking,
// clearBooking,
// getSavedBooking,
// };

// return <InvestContext.Provider value={value}>{children}</InvestContext.Provider>;

// const DEFAULT_STATE = {
//     code: 0,
//     expires: 0,
//     amount: 0,
//     signature: "",
// };

// const useInvestStore = create((set) => ({
//     booking: DEFAULT_STATE,
//     offerId: 0,
//     setOfferId: (offerId) => set(() => ({ offerId })),
//     setBooking: (booking) => set(() => ({ booking })),
// }));

//     // const setBooking = (booking) => {
//     //     const expires = Number(booking.expires);
//     //     const obj = {
//     //         code: booking.hash,
//     //         expires: expires,
//     //         amount: Number(booking.amount),
//     //         signature: booking.signature,
//     //     };
//     //     setBookingDetails(obj);
//     //     setCookie(`hash_${offerId}`, `${JSON.stringify(obj)}`, {
//     //         expires: new Date(expires * 1000),
//     //     });
//     // };

//     // setBooking: (booking) => {
//     //     const expires = Number(booking.expires);

//     //     set((state) => ({
//     //         ...state,
//     //         booking: {
//     //             code: booking.hash,
//     //             expires: expires,
//     //             amount: Number(booking.amount),
//     //             signature: booking.signature,
//     //         }
//     //     }));
//     //     const [_, setCookie] = get().cookies;

//         // setCookie(`hash_${offerId}`, JSON.stringify(obj), { expires: new Date(expires * 1000) });

// export default function useInvestContext(offerId) {
//     const [cookies, setCookie, removeCookie] = useCookies();
//     const { booking } = useInvestmentStore();

//     const setOfferIdStore = useInvestStore((state) => state.setOfferId);
//     const setBookingStore = useInvestStore((state) => state.setBooking);

//     console.log("BOOKING", booking)

//     // Check if there is hash in session and if yes, set in zustand
//     useEffect(() => {
//         // const cookie = cookies[`hash_${offerId}`];

//         // if (!!cookie) {
//         //     const parsedCookie = {
//         //         code: cookie.code,
//         //         expires: Number(cookie.expires),
//         //         amount: Number(cookie.amount),
//         //         signature: cookie.signature,
//         //       };

//         //     //   useInvestStore.setState({ bookingDetails: parsedCookie });
//         // }

//         // console.log("IE :: LOAD");
//         // console.log("IE :: LOAD", cookie);

//         // if (!!cookie) {
//         //     setBookingDetails({
//         //         code: cookie.code,
//         //         expires: Number(cookie.expires),
//         //         amount: Number(cookie.amount),
//         //         signature: cookie.signature,
//         //     });
//         //     console.log("IE :: savedCookie", cookie);
//         // }
//         // console.log("IE :: initialData", initialData);
//         // setOfferId(initialData);
//     }, [offerId]);

//     const setBooking = (booking) => {
//         const expires = Number(booking.expires);
//         const obj = {
//             code: booking.hash,
//             expires: expires,
//             amount: Number(booking.amount),
//             signature: booking.signature,
//         };

//         setBookingStore(obj);

//         setCookie(`hash_${offerId}`, `${JSON.stringify(obj)}`, {
//             expires: new Date(expires * 1000),
//         });
//     };

//     // const getSavedBooking = () => {
//     //     const saved = cookies[`hash_${offerId}`];
//     //     return !!saved ? { ok: true, ...saved } : { ok: false };
//     // };

//

//

//     // useEffect(() => {
//     //     setCookie(`hash_${offerId}`, `${JSON.stringify(DEFAULT_STATE)}`, { expires: new Date(100 * 1000) });
//     // }, []);

//     // useEffect(() => {
//     //     console.log("IE :: LOAD");
//     //     const cookie = cookies[`hash_${initialData}`];
//     //     console.log("IE :: LOAD", cookie);

//     //     if (!!cookie) {
//     //         setBookingDetails({
//     //             code: cookie.code,
//     //             expires: Number(cookie.expires),
//     //             amount: Number(cookie.amount),
//     //             signature: cookie.signature,
//     //         });
//     //         console.log("IE :: savedCookie", cookie);
//     //     }
//     //     console.log("IE :: initialData", initialData);
//     //     setOfferId(offerId);
//     // }, [offerId]);

//     // const clearBooking = () => {
//     //     const removedCookieContent = cookies[`hash_${offerId}`];
//     //     console.log("clean", bookingDetails, removedCookieContent);
//     //     removeCookie(`hash_${offerId}`, { path: "/app/offer" });
//     //     setBookingDetails(DEFAULT_STATE);
//     // };

//     // const removeBookingCookie = useCallback(() => {
//     //     clearBookingCookie();
//     //     removeCookie(INVESTMENT_BOOKING_COOKIE, { path: '/' });
//     // }, [clearBookingCookie, removeCookie]);

//     return {
//         cookies,
//         booking,
//         setBooking
//     }
// }

// export const INVESTMENT_BOOKING_COOKIE = "investmentBooking";

// const useInvestmentStore = create((set) => ({
//     bookingCookie: null,
//     setBookingCookie: (cookie) => set({ bookingCookie: cookie }),
//     clearBookingCookie: () => set({ bookingCookie: null }),
// }));

// export default function useInvestmentContext() {
//     const [cookies, setCookie, removeCookie] = useCookies([INVESTMENT_BOOKING_COOKIE]);
//     const { bookingCookie, setBookingCookie, clearBookingCookie } = useInvestmentStore();

//     useEffect(() => {
//         if (cookies.investmentBooking) {
//             setBookingCookie(cookies.investmentBooking);
//         }
//     }, [cookies.investmentBooking, setBookingCookie]);

//     const saveBookingCookie = useCallback((bookingData) => {
//         setBookingCookie(bookingData);
//         setCookie(INVESTMENT_BOOKING_COOKIE, bookingData, { path: '/' });
//     }, [setBookingCookie, setCookie]);

//     const removeBookingCookie = useCallback(() => {
//         clearBookingCookie();
//         removeCookie(INVESTMENT_BOOKING_COOKIE, { path: '/' });
//     }, [clearBookingCookie, removeCookie]);

//     return {
//         saveBookingCookie,
//         removeBookingCookie,
//     };
// };

// //
// //
// //

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useCookies } from "react-cookie";

// const DEFAULT_STATE = {
//     code: 0,
//     expires: 0,
//     amount: 0,
//     signature: "",
// };

// const InvestContext = createContext({
//     getSavedBooking: () => {},
//     clearBooking: () => {},
//     setBooking: () => {},
// });

// export const useInvestContext = () => useContext(InvestContext);

// export const InvestProvider = ({ children, initialData }) => {
//     const [cookies, setCookie, removeCookie] = useCookies();
//     const [bookingDetails, setBookingDetails] = useState(DEFAULT_STATE);
//     const [offerId, setOfferId] = useState(0);

//     useEffect(() => {
//         console.log("IE :: LOAD");
//         const cookie = cookies[`hash_${initialData}`];
//         console.log("IE :: LOAD", cookie);

//         if (!!cookie) {
//             setBookingDetails({
//                 code: cookie.code,
//                 expires: Number(cookie.expires),
//                 amount: Number(cookie.amount),
//                 signature: cookie.signature,
//             });
//             console.log("IE :: savedCookie", cookie);
//         }
//         console.log("IE :: initialData", initialData);
//         setOfferId(initialData);
//     }, [initialData]);

//     const setBooking = (booking) => {
//         const expires = Number(booking.expires);
//         const obj = {
//             code: booking.hash,
//             expires: expires,
//             amount: Number(booking.amount),
//             signature: booking.signature,
//         };
//         setBookingDetails(obj);
//         setCookie(`hash_${offerId}`, `${JSON.stringify(obj)}`, {
//             expires: new Date(expires * 1000),
//         });
//     };

//     const getSavedBooking = () => {
//         const saved = cookies[`hash_${offerId}`];
//         return !!saved ? { ok: true, ...saved } : { ok: false };
//     };

//     const value = {
//         bookingDetails,
//         setBooking,
//         clearBooking,
//         getSavedBooking,
//     };

//     return <InvestContext.Provider value={value}>{children}</InvestContext.Provider>;
// };
