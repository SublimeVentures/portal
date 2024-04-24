import { useEffect, useMemo, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";

export default function CustomFlipClockCountdown({ className, onComplete, to, labels, labelStyle }) {
    const [_, forceRender] = useState({});

    useEffect(() => {
        const forceUpdate = () => forceRender({});
        document.addEventListener("visibilitychange", forceUpdate);

        return () => document.removeEventListener("visibilitychange", forceUpdate);
    }, []);

    const FlipClockCountdownContent = useMemo(
        () => (
            <FlipClockCountdown
                key={_}
                labelStyle={labelStyle}
                className={className}
                onComplete={onComplete}
                to={to}
                labels={labels}
            />
        ),
        [_],
    );

    return FlipClockCountdownContent;
}
