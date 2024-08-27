import { formatPercentage } from "@/v2/helpers/formatters";
import { cn } from "@/lib/cn";

export default function PercentWrapper({ value }) {
    return (
        <span
            className={cn({
                "text-success-500": Number(value) > 0,
                "text-error-500": Number(value) < 0,
            })}
        >
            {Number(value) == 0 ? "TBA" : formatPercentage(value / 100, true)}
        </span>
    );
}
