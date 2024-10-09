import { useCookies } from "react-cookie";
import moment from "moment";

import { useOfferDetailsQuery } from "./queries";
import { routes } from "@/v2/routes";

const DEFAULT_STATE = {
    code: 0,
    expires: 0,
    amount: 0,
    signature: "",
};

export default function useInvestContext() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const { data: offer } = useOfferDetailsQuery();
    const offerId = offer?.id;

    const getCookieKey = () => `hash_${offerId}`;

    const setBooking = (booking) => {
        if (!offerId) return;

        const expires = Number(booking.expires);

        const cookieData = {
            code: booking.hash,
            expires,
            date: moment().unix(),
            amount: Number(booking.amount),
            signature: booking.signature,
        };

        setCookie(getCookieKey(), JSON.stringify(cookieData), { expires: new Date(expires * 1000) });
    };

    const clearBooking = () => {
        if (!offerId) return;
        removeCookie(getCookieKey(), { path: routes.Opportunities });
    };

    const getSavedBooking = () => {
        if (!offerId) return;
        const cookie = cookies[getCookieKey()] ?? null;
        return cookie ? { ok: true, ...cookie } : { ok: false, ...DEFAULT_STATE };
    };

    return {
        getSavedBooking,
        setBooking,
        clearBooking,
    };
}
