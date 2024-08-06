// Source https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const settingsKeyValues = Object.freeze({
    wallets: "wallets",
})

export const settingsKeys = Object.freeze({
    wallets: [settingsKeyValues.wallets],
    userWallets: (userId) => [...settingsKeys.wallets, { userId }],
});
