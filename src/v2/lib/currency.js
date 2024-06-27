export const formatCurrency = (amount) => {
  const thresholds = [
    { limit: 1_000_000_000, divisor: 1_000_000_000, suffix: "B+" },
    { limit: 1_000_000, divisor: 1_000_000, suffix: "M+" },
    { limit: 1_000, divisor: 1_000, suffix: "K+" }
  ];

  let number = Number(amount);
  const defaultFormatOptions = { style: "decimal", maximumFractionDigits: 2, minimumFractionDigits: 2 };
  let formattedNumber;

  for (const { limit, divisor, suffix } of thresholds) {
    if (number >= limit) {
      number /= divisor;
      formattedNumber = new Intl.NumberFormat("en-US", { ...defaultFormatOptions, maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(number);
      return `$${formattedNumber}${suffix}`;
    }
  }

  formattedNumber = new Intl.NumberFormat("en-US", defaultFormatOptions).format(number);
  return `$${formattedNumber}`;
};
