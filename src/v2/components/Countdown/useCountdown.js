import { useEffect, useState } from "react";

const formatTimeUnit = (unit) => unit.toString().padStart(2, "0");

const getReturnValues = (countDown) => {
    const days = formatTimeUnit(Math.floor(countDown / (1000 * 60 * 60 * 24)));
    const hours = formatTimeUnit(Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = formatTimeUnit(Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = formatTimeUnit(Math.floor((countDown % (1000 * 60)) / 1000));

    return [days, hours, minutes, seconds];
};

// Add update countdown for browser tab on active
// Test update phase on mount
// Test update phase with timeToNextPhase
// Test how it will behave in a real-world scenario - e.g., when multiple pages are open and the internet connection is slower
export const useCountdown = (targetDate, onComplete = () => {}) => {
    const countDownDate = new Date(targetDate).getTime();
    const [countDown, setCountDown] = useState(null);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const timeLeft = countDownDate - now;

            if (timeLeft <= 0) {
                setCountDown(0);
                onComplete();
            } else {
                setCountDown(timeLeft);
            }

            setCountDown(countDownDate - now);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                updateCountdown();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [countDownDate, onComplete]);

    return countDown === null || countDown < 0 ? ["00", "00", "00", "00"] : getReturnValues(countDown);
};
