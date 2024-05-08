import { useCallback } from "react";

const useLocalStorage = () => {
    const setExpireData = useCallback(
        (key, data, expireDate) => localStorage.setItem(key, JSON.stringify({ data, expireDate })),
        [],
    );

    const getExpireData = useCallback((key) => {
        try {
            const { data, expireDate } = JSON.parse(localStorage.getItem(key));

            if (new Date() < new Date(expireDate)) {
                return data;
            }

            localStorage.removeItem(key);
            return null;
        } catch (error) {
            localStorage.removeItem(key);

            return null;
        }
    }, []);

    return { setExpireData, getExpireData };
};

export default useLocalStorage;
