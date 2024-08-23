export function formatPercentage(value, witSign = false) {
    const percent = Number(value).toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    if (witSign) {
        const sign = value > 0 ? "+" : value < 0 ? "-" : "";
        return `${sign}${percent}`;
    }
    return percent;
}

export function formatCurrency(value, currency = "USD") {
    const isToken = currency !== "USD";
    const number = Number(value).toLocaleString("en-US", {
        ...(isToken ? {} : { style: "currency", currency }),
        minimumFractionDigits: value % 1 ? 2 : 0,
        maximumFractionDigits: 2,
    });
    return isToken ? `${number} ${currency}` : number;
}
