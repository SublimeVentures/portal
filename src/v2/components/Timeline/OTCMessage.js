import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";

export default function OtcMessage({ action, values = {} }) {
    const { getCurrencySymbolByAddress } = useEnvironmentContext();
    const { amount = 0, currency = "", price = 0 } = values ?? {};
    const symbol = getCurrencySymbolByAddress(currency);

    if (!symbol) {
        return null
    }

    return (
        <span className="flex items-center">
            {`${action} ${amount} ${symbol}`}
            <DynamicIcon className="mx-2 p-1 w-6 h-6 inline rounded-full" name={symbol} />
            {` units at $${price.toFixed(2)} each.`}
        </span>
    );
}
