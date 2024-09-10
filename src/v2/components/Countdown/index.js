import { useCountdown } from "./useCountdown";

const DateTimeDisplay = ({ children, type }) => {
    return (
        <div className="inline-flex whitespace-nowrap">
            <p className="mr-1">{children}</p>
            <span>{type}</span>
        </div>
    );
};

export default function Countdown({ countStart, onComplete = () => {} }) {
    const [days, hours, minutes, seconds] = useCountdown(countStart, onComplete);
    const endDate = new Date(countStart).toISOString();

    return (
        <time className="flex gap-2" date={endDate} pubdate>
            <DateTimeDisplay type="Days . ">{days}</DateTimeDisplay>
            <DateTimeDisplay type="Hours . ">{hours}</DateTimeDisplay>
            <DateTimeDisplay type="Minutes . ">{minutes}</DateTimeDisplay>
            <DateTimeDisplay type="Seconds">{seconds}</DateTimeDisplay>
        </time>
    );
};
