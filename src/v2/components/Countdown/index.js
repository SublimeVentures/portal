import { useCountdown } from "./useCountdown";
import { cn } from "@/lib/cn";

const DateTimeDisplay = ({ children, type }) => {
    return (
        <div className="inline-flex text-foreground whitespace-nowrap">
            <p className="mr-1 font-mono">{children}</p>
            <span>{type}</span>
        </div>
    );
};

export const defaultUnits = {
    days: "Days . ",
    hours: "Hours . ",
    minutes: "Minutes . ",
    seconds: "Seconds",
};

export default function Countdown({ countStart, units = defaultUnits, onComplete = () => {}, className }) {
    const [days, hours, minutes, seconds] = useCountdown(countStart, onComplete);
    const endDate = new Date(countStart).toISOString();

    const timeValues = { days, hours, minutes, seconds };

    return (
        <time className={cn("flex gap-2", className)} date={endDate} pubdate>
            {Object.keys(units).map((key) => {
                const type = units[key];
                return (
                    type && (
                        <DateTimeDisplay key={key} type={type}>
                            {timeValues[key]}
                        </DateTimeDisplay>
                    )
                );
            })}
        </time>
    );
}
