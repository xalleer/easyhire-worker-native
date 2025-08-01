export const formatBalance = (amount: number | undefined | null) => {
    if (typeof amount !== "number") return "0.00";

    return new Intl.NumberFormat("uk-UA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
