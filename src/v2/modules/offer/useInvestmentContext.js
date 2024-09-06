import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { useCookies } from 'react-cookie';

const INVESTMENT_BOOKING_COOKIE = "investmentBooking";

const useInvestmentStore = create((set) => ({
    bookingCookie: null,
    setBookingCookie: (cookie) => set({ bookingCookie: cookie }),
    clearBookingCookie: () => set({ bookingCookie: null }),
}));

export default function useInvestmentContext() {
    const [cookies, setCookie, removeCookie] = useCookies([INVESTMENT_BOOKING_COOKIE]);
    const { bookingCookie, setBookingCookie, clearBookingCookie } = useInvestmentStore();

    useEffect(() => {
        if (cookies.investmentBooking) {
            setBookingCookie(cookies.investmentBooking);
        }
    }, [cookies.investmentBooking, setBookingCookie]);

    const saveBookingCookie = useCallback((bookingData) => {
        setBookingCookie(bookingData);
        setCookie(INVESTMENT_BOOKING_COOKIE, bookingData, { path: '/' });
    }, [setBookingCookie, setCookie]);

    const removeBookingCookie = useCallback(() => {
        clearBookingCookie();
        removeCookie(INVESTMENT_BOOKING_COOKIE, { path: '/' });
    }, [clearBookingCookie, removeCookie]);


    return {
        saveBookingCookie,
        removeBookingCookie,
    };   
};
