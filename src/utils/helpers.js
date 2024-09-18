export const formatCurrency = (amount, currency) => {
    return `${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${currency?.symbol}`;
};
